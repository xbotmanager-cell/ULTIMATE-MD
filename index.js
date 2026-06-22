import { validateEnv } from './lib/env.js';
import { initDb } from './lib/db.js';
import { loadAll } from './lib/loader.js';
import { logInfo, logError } from './lib/logger.js';
import express from 'express';
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { get } from './lib/db.js';

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
    browser: Browsers.ubuntu('Chrome'),
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,
    defaultQueryTimeoutMs: 60000,
    syncFullHistory: false,
    markOnlineOnConnect: !isGhost,
    sendReceipts: !isGhost
  });

  sock.ev.on('creds.update', saveCreds);

  for (const event of global.events) {
    if (event.name && event.execute) {
      sock.ev.on(event.name, (data) => event.execute(sock, data));
    }
  }
};

app.listen(port, () => {
  logInfo(`Express server listening on port ${port}`);
  startBot().catch(err => logError(`Bot failed to start: ${err.message}`));
});
