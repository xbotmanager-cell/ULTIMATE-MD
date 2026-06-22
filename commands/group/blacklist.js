import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'blacklist',
  alias: ['bl'],
  desc: 'ʙᴀɴ ᴡᴏʀᴅs ʟɪsᴛ',
  category: 'group',
  react: '📛',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const filter = get('blacklist') || {};
      filter[msg.key.remoteJid] = filter[msg.key.remoteJid] || [];
      const sub = args[0];
      const word = args.slice(1).join(' ').toLowerCase();
      
      if (sub === 'add' && word) {
         if (!filter[msg.key.remoteJid].includes(word)) filter[msg.key.remoteJid].push(word);
         set('blacklist', filter);
         return sock.sendMessage(msg.key.remoteJid, { text: createBox('ʙʟᴀᴄᴋʟɪsᴛ', [formatLine('ᴀᴅᴅᴇᴅ', word)]) }, { quoted: msg });
      } else if (sub === 'del' && word) {
         filter[msg.key.remoteJid] = filter[msg.key.remoteJid].filter(w => w !== word);
         set('blacklist', filter);
         return sock.sendMessage(msg.key.remoteJid, { text: createBox('ʙʟᴀᴄᴋʟɪsᴛ', [formatLine('ʀᴇᴍᴏᴠᴇᴅ', word)]) }, { quoted: msg });
      } else {
         const words = filter[msg.key.remoteJid].length > 0 ? filter[msg.key.remoteJid].join(', ') : 'None';
         return sock.sendMessage(msg.key.remoteJid, { text: createBox('ʙʟᴀᴄᴋʟɪsᴛᴇᴅ', [formatLine('ᴡᴏʀᴅs', words)]) }, { quoted: msg });
      }
    } catch (err) { }
  }
};
