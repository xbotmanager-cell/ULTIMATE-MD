import { logInfo, logError, logWarn } from '../lib/logger.js';
import { DisconnectReason } from '@whiskeysockets/baileys';
import { createBox, formatLine } from '../system/box.js';

export default {
  name: 'connection.update',
  execute: async (sock, update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      
      if (reason === DisconnectReason.loggedOut) {
        logError('💥 Yikes! Device logged out. Please nuke the sessions folder and scan again!');
        process.exit(0);
      } else if (reason === DisconnectReason.connectionReplaced) {
        logWarn('🚦 Hold up! Connection replaced. Another session opened elsewhere.');
        process.exit(0);
      } else if (reason === DisconnectReason.restartRequired) {
        logInfo('🔄 Hold tight, restarting engines...');
        process.exit(1);
      } else {
        logWarn(`⚠️ Connection closed with reason: ${reason || 'Unknown'}, attempting to bounce back...`);
        process.exit(1);
      }
    } else if (connection === 'open') {
      logInfo('🚀 BOOM! WhatsApp connection opened successfully. Systems are ONLINE.');
      try {
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const pingMsg = createBox('sᴡɪғᴛ ʙᴏᴛ', [
          formatLine('sᴛᴀᴛᴜs', 'ᴏɴʟɪɴᴇ & ʀᴇᴀᴅʏ 🔥'),
          formatLine('ᴠᴇʀsɪᴏɴ', 'LATEST'),
          formatLine('ᴍᴏᴅᴇ', 'ACTIVATED')
        ]);
        await sock.sendMessage(botNumber, { text: pingMsg });
        logInfo('✉️ Sent connection success message to the owner!');
      } catch (err) {
        logError('Failed to send connection success message: ' + err.message);
      }
    }
  }
};
