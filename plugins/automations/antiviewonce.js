import { isEnabledInScope } from '../../lib/scope.js';
import { logError } from '../../lib/logger.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default async function antiviewonce(sock, msg) {
  try {
    if (msg.key.fromMe) return;
    if (!isEnabledInScope('antiviewonce', msg)) return;

    let messageContent = msg.message;
    if (!messageContent) return;

    let type = Object.keys(messageContent)[0];
    if (type === 'ephemeralMessage') {
        messageContent = messageContent.ephemeralMessage.message;
        type = Object.keys(messageContent)[0];
    } else if (type === 'documentWithCaptionMessage') {
        messageContent = messageContent.documentWithCaptionMessage.message;
        type = Object.keys(messageContent)[0];
    }

    const isViewOnce = type === 'viewOnceMessage' || type === 'viewOnceMessageV2' || type === 'viewOnceMessageV2Extension' || messageContent[type]?.viewOnce;
    
    if (isViewOnce) {
      const jid = msg.key.remoteJid;
      const mediaMsg = type.startsWith('viewOnceMessage') ? messageContent[type].message : messageContent;
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
