import { logInfo, logError, logWarn } from '../lib/logger.js';
import { DisconnectReason } from '@whiskeysockets/baileys';
import { createBox, formatLine } from '../system/box.js';
import { get } from '../lib/db.js';

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  let res = '';
  if (d > 0) res += `${d}d `;
  if (h > 0) res += `${h}h `;
  if (m > 0) res += `${m}m `;
  res += `${s}s`;
  return res;
}

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
      } else if (reason === 405 || reason === 401 || reason === 403 || reason === 500 || reason === 503 || reason === 428) {
        logError(`🛑 CRITICAL: Connection closed with ban-risk/restricted reason (${reason}). Shutting down cleanly to prevent ban risk. Restart manually if needed.`);
        process.exit(0);
      } else {
        logWarn(`⚠️ Connection closed with reason: ${reason || 'Unknown'}, attempting to bounce back...`);
        process.exit(1);
      }
    } else if (connection === 'open') {
      logInfo('🚀 BOOM! WhatsApp connection opened successfully. Systems are ONLINE.');
      try {
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const prefix = get('prefix') || '$';
        const mode = get('mode') || 'public';
        const uptime = formatUptime(process.uptime());
        
        const pingMsg = createBox('sᴡɪғᴛ ʙᴏᴛ', [
          formatLine('ᴏᴡɴᴇʀ', sock.user.id.split(':')[0]),
          formatLine('ᴘʀᴇғɪx', prefix),
          formatLine('ᴍᴏᴅᴇ', mode.toUpperCase()),
          formatLine('ᴅᴀᴛᴀʙᴀsᴇ', process.env.SUPABASE_URL ? 'Supabase' : process.env.MONGODB_URI ? 'MongoDB' : 'Local/Memory'),
          formatLine('ᴜᴘᴛɪᴍᴇ', uptime)
        ]);

        await sock.sendMessage(botNumber, { 
          image: { url: 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png' },
          caption: pingMsg 
        });
        logInfo('✉️ Sent connection success message to the owner!');
      } catch (err) {
        logError('Failed to send connection success message: ' + err.message);
      }
    }
  }
};
