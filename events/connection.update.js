import { logInfo, logError, logWarn } from '../lib/logger.js';
import { DisconnectReason } from '@whiskeysockets/baileys';

export default {
  name: 'connection.update',
  execute: async (sock, update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      
      if (reason === DisconnectReason.loggedOut) {
        logError('Device logged out, please delete sessions folder and scan again.');
      } else if (reason === DisconnectReason.connectionReplaced) {
        logWarn('Connection Replaced, Another New Session Opened, Please Close Current Session First');
      } else if (reason === DisconnectReason.restartRequired) {
        logInfo('Restart required, restarting...');
      } else {
        logWarn(`Connection closed with reason: ${reason || 'Unknown'}, attempting to reconnect...`);
      }
    } else if (connection === 'open') {
      logInfo('WhatsApp connection opened successfully!');
    }
  }
};
