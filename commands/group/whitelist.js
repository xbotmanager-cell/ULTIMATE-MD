import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'whitelist',
  alias: ['wl'],
  desc: 'ᴀʟʟᴏᴡ ᴡᴏʀᴅs ʟɪsᴛ',
  category: 'group',
  react: '✅',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const filter = get('whitelist') || {};
      filter[msg.key.remoteJid] = filter[msg.key.remoteJid] || [];
      const sub = args[0];
      const word = args.slice(1).join(' ').toLowerCase();
      
      if (sub === 'add' && word) {
         if (!filter[msg.key.remoteJid].includes(word)) filter[msg.key.remoteJid].push(word);
         set('whitelist', filter);
         return sock.sendMessage(msg.key.remoteJid, { text: createBox('ᴡʜɪᴛᴇʟɪsᴛ', [formatLine('ᴀᴅᴅᴇᴅ', word)]) }, { quoted: msg });
      } else if (sub === 'del' && word) {
         filter[msg.key.remoteJid] = filter[msg.key.remoteJid].filter(w => w !== word);
         set('whitelist', filter);
         return sock.sendMessage(msg.key.remoteJid, { text: createBox('ᴡʜɪᴛᴇʟɪsᴛ', [formatLine('ʀᴇᴍᴏᴠᴇᴅ', word)]) }, { quoted: msg });
      } else {
         const words = filter[msg.key.remoteJid].length > 0 ? filter[msg.key.remoteJid].join(', ') : 'None';
         return sock.sendMessage(msg.key.remoteJid, { text: createBox('ᴡʜɪᴛᴇʟɪsᴛᴇᴅ', [formatLine('ᴡᴏʀᴅs', words)]) }, { quoted: msg });
      }
    } catch (err) { }
  }
};
