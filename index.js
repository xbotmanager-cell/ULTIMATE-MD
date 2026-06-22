import { validateEnv } from './lib/env.js';
import { initDb } from './lib/db.js';
import { loadAll } from './lib/loader.js';
import { logInfo, logError } from './lib/logger.js';
import express from 'express';
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { get, set } from './lib/db.js';
import { Boom } from '@hapi/boom';

config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running');
});

const startBot = async () => {
  validateEnv();
  
  if (!fs.existsSync('./sessions')) {
    fs.mkdirSync('./sessions', { recursive: true });
  }

  const sessionId = process.env.SESSION_ID;
  const credsPath = path.join('./sessions', 'creds.json');
  if (sessionId && sessionId.startsWith('SWIFTBOT~') && !fs.existsSync(credsPath)) {
    try {
      const base64Data = sessionId.replace('SWIFTBOT~', '');
      const jsonData = Buffer.from(base64Data, 'base64').toString('utf-8');
      fs.writeFileSync(credsPath, jsonData);
      logInfo('Session decoded and creds.json written successfully.');
    } catch (err) {
      logError('Failed to decode SESSION_ID: ' + err.message);
    }
  }

  await initDb();
  await loadAll();

  const { state, saveCreds } = await useMultiFileAuthState('./sessions');

  const currentMode = get('mode') || 'public';
  const isGhost = currentMode === 'ghost';

  const { version } = await fetchLatestBaileysVersion();
  logInfo(`Using Baileys v${version.join('.')}`);

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: Browsers.macOS('Desktop'),
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 15000,
    defaultQueryTimeoutMs: 60000,
    syncFullHistory: false,
    markOnlineOnConnect: !isGhost,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => { return { conversation: 'Hello' }; }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log('Connection closed. Reason: ', reason);
        
        switch (reason) {
            case DisconnectReason.badSession:
                logError('Bad Session File, Please Delete ./sessions and Scan Again');
                // Could potentially notify owner via SMS or Email here since we can't send WA message without connection
                console.log('🚨 ALERT OWNER: BAD MAC OR SESSION, CREATE NEW SESSION!');
                process.exit(1); 
                break;
            case DisconnectReason.connectionClosed:
            case DisconnectReason.connectionLost:
            case DisconnectReason.connectionReplaced:
            case DisconnectReason.restartRequired:
            case DisconnectReason.timedOut:
                logInfo('Reconnecting...');
                startBot();
                break;
            case DisconnectReason.loggedOut:
                logError('Device Logged Out. Delete ./sessions and Scan Again.');
                process.exit(1);
                break;
            default:
                startBot();
        }
    } else if (connection === 'open') {
        logInfo('Connected to WhatsApp successfully!');
        
        // Anti-ban simulation & automated connections
        // Send connection success message to owner
        const ownerNumber = process.env.OWNER_NUMBER ? `${process.env.OWNER_NUMBER.replace(/[^0-9]/g, '')}@s.whatsapp.net` : null;
        if (ownerNumber) {
            const botname = get('botname') || 'ULTIMATE-MD';
            try {
                await sock.sendMessage(ownerNumber, { text: `✅ *${botname}* is now ONLINE and connected safely!` });
                startGreetings(sock, ownerNumber, botname);
            } catch(e) {}
        }
    }
  });

  for (const event of global.events) {
    if (event.name && event.execute) {
        if(event.name === 'connection.update') continue; // Handled here
        sock.ev.on(event.name, (data) => event.execute(sock, data));
    }
  }
};

const startGreetings = (sock, owner, botname) => {
    setInterval(async () => {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        
        // trigger roughly at the exact hour if we check every minute
        if (minute === 0 && second <= 30) {
            let msg = '';
            const m = get('mode') || 'public';
            const pf = get('prefix') || '/';
            const antilink = get('antilink') ? 'ON' : 'OFF';
            const antispam = get('antispam') ? 'ON' : 'OFF';
            const info = `\n\n📌 *STATUS*\nPrefix: ${pf}\nMode: ${m}\nAntiLink: ${antilink}\nAntiSpam: ${antispam}`;
            
            if (hour === 7) {
                msg = `🌅 *Good Morning!* 🌅\nfrom *${botname}*\nHey boss, getting ready for the day? I never sleep, I'm just here chilling!${info}`;
            } else if (hour === 18) {
                msg = `🌆 *Good Evening!* 🌆\nfrom *${botname}*\nHope you had a great day! I'm still up and running smoothly!${info}`;
            } else if (hour === 22) {
                msg = `🌙 *Good Night!* 🌙\nfrom *${botname}*\nTime for bed boss! Don't worry, I never sleep, I'll guard the chats!${info}`;
            }
            
            if (msg !== '') {
                try {
                    await sock.sendMessage(owner, { text: msg });
                } catch(e) {}
            }
        }
    }, 30000); // Check every 30 seconds
};

app.listen(port, () => {
  logInfo(`Express server listening on port ${port}`);
  startBot().catch(err => logError(`Bot failed to start: ${err.message}`));
});

