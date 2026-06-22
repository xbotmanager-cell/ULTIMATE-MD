import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'blur',
  desc: 'Media tool: blur',
  category: 'mediatools',
  execute: async (sock, msg, args) => {
      const botname = get('botname') || 'ULTIMATE-MD';
      try {
         const box = createBox(botname, [
            formatLine('ᴛᴏᴏʟ', 'BLUR'),
            formatLine('sᴛᴀᴛᴜs', 'Processing (simulated output)')
         ]);
         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: `Error in media tool ${cmd}.` });
      }
  }
};
