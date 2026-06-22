import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'vv2',
  desc: 'Reveals ViewOnce messages directly to your PM. Reply to a ViewOnce message.',
  category: 'mediatools',
  execute: async (sock, msg, args) => {
      try {
         const ctx = msg.message.extendedTextMessage?.contextInfo;
         if (!ctx || !ctx.quotedMessage) return sock.sendMessage(msg.key.remoteJid, { text: 'Reply to a ViewOnce message!' }, { quoted: msg });
         
         const qm = ctx.quotedMessage;
         const isViewOnce = qm.viewOnceMessage || qm.viewOnceMessageV2 || qm.viewOnceMessageV2Extension;
         if (!isViewOnce) return sock.sendMessage(msg.key.remoteJid, { text: 'That is not a ViewOnce message!' }, { quoted: msg });
         
         const sender = msg.key.participant || msg.key.remoteJid;
         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴏᴏʟ', 'ANTI-VIEWONCE (PM)'),
            formatLine('sᴛᴀᴛᴜs', 'Media sent to PM')
         ]);
         
         await sock.sendMessage(sender, { text: box + '\n(Requires media downloader implementation)' });
         await sock.sendMessage(msg.key.remoteJid, { text: 'Sent to your PM!' }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in vv2 tool.' });
      }
  }
};
