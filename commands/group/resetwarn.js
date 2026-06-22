import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'resetwarn',
  alias: ['rw'],
  desc: 'ᴄʟᴇᴀʀ ᴀʟʟ ᴡᴀʀɴs',
  category: 'group',
  react: '🗑️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const warns = get('warns') || {};
      const gWarns = warns[msg.key.remoteJid] || {};
      const count = Object.keys(gWarns).length;
      warns[msg.key.remoteJid] = {};
      set('warns', warns);
      const box = createBox('ᴡᴀʀɴ ʀᴇsᴇᴛ', [formatLine('ᴄʟᴇᴀʀᴇᴅ', `${count} users`), formatLine('sᴛᴀᴛᴜs', 'Amnesia deployed')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
