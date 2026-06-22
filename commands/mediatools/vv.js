import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'vv',
  alias: ['viewonce', 'retrive'],
  desc: 'Reveals ViewOnce messages. Reply to a ViewOnce message.',
  category: 'mediatools',
  execute: async (sock, msg, args) => {
      try {
         const ctx = msg.message.extendedTextMessage?.contextInfo;
         if (!ctx || !ctx.quotedMessage) return sock.sendMessage(msg.key.remoteJid, { text: 'Reply to a ViewOnce message!' }, { quoted: msg });
         
         const qm = ctx.quotedMessage;
         const isViewOnce = qm.viewOnceMessage || qm.viewOnceMessageV2 || qm.viewOnceMessageV2Extension;
         if (!isViewOnce) return sock.sendMessage(msg.key.remoteJid, { text: 'That is not a ViewOnce message!' }, { quoted: msg });
         
         const vo = isViewOnce.message.imageMessage || isViewOnce.message.videoMessage || isViewOnce.message.audioMessage;
         if (!vo) return sock.sendMessage(msg.key.remoteJid, { text: 'Unsupported ViewOnce media.' }, { quoted: msg });
         
         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴏᴏʟ', 'ANTI-VIEWONCE'),
            formatLine('sᴛᴀᴛᴜs', 'Media Revealed')
         ]);
         
         await sock.sendMessage(msg.key.remoteJid, { text: box + '\n(Requires media downloader implementation)' }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in vv tool.' });
      }
  }
};
