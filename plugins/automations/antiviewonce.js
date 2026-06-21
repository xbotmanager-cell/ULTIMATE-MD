import { isEnabledInScope } from '../../lib/scope.js';
import { logError } from '../../lib/logger.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default async function antiviewonce(sock, msg) {
  try {
    if (msg.key.fromMe) return;
    if (!isEnabledInScope('antiviewonce', msg)) return;

    const messageContent = msg.message;
    if (!messageContent) return;

    const type = Object.keys(messageContent)[0];
    
    if (type === 'viewOnceMessage' || type === 'viewOnceMessageV2') {
      const jid = msg.key.remoteJid;
      const mediaMsg = messageContent[type].message;
      const mediaType = Object.keys(mediaMsg)[0]; // imageMessage, videoMessage, etc.

      // We need to pass a mocked msg object to downloadMediaMessage
      const mockMsg = {
         key: msg.key,
         message: mediaMsg
      };

      try {
         const buffer = await downloadMediaMessage(mockMsg, 'buffer', {}, { logger: sock.logger, reuploadRequest: sock.updateMediaMessage });
         const caption = mediaMsg[mediaType].caption || '';
         const pushName = msg.pushName || 'Unknown';
         const text = `👁️ *View Once detected* from ${pushName}\n${caption ? `*Caption:* ${caption}` : ''}`;
         
         if (mediaType === 'imageMessage') {
             await sock.sendMessage(jid, { image: buffer, caption: text }, { quoted: msg });
         } else if (mediaType === 'videoMessage') {
             await sock.sendMessage(jid, { video: buffer, caption: text }, { quoted: msg });
         } else if (mediaType === 'audioMessage') {
             await sock.sendMessage(jid, { audio: buffer, mimetype: 'audio/mp4', ptt: true }, { quoted: msg });
             await sock.sendMessage(jid, { text: text }, { quoted: msg });
         }
      } catch (err) {
         logError(`Download View Once Error: ${err.message}`);
      }
    }
  } catch (err) {
    logError(`Antiviewonce Error: ${err.message}`);
  }
}
