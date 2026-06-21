import { validateEnv } from './lib/env.js';
import { initDb } from './lib/db.js';
import { loadAll } from './lib/loader.js';
import { logInfo, logError } from './lib/logger.js';
import express from 'express';
import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

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
  if (sessionId && sessionId.startsWith('SWIFTBOT~')) {
    try {
      const base64Data = sessionId.replace('SWIFTBOT~', '');
      const jsonData = Buffer.from(base64Data, 'base64').toString('utf-8');
      fs.writeFileSync('./sessions/creds.json', jsonData);
      logInfo('Session decoded and creds.json written successfully.');
    } catch (err) {
      logError('Failed to decode SESSION_ID: ' + err.message);
    }
  }

  await initDb();
  await loadAll();

  const { state, saveCreds } = await useMultiFileAuthState('./sessions');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '20.0.0'],
    markOnlineOnConnect: false
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
