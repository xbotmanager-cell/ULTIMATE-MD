import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'autounmute',
  alias: ['aum'],
  desc: 'ᴀᴜᴛᴏ ᴏᴘᴇɴ ᴍᴏʀɴɪɴɢ',
  category: 'group',
  react: '☀️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const time = args[0];
      if (!time) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a time in 24h format (e.g., 08:00)' }, { quoted: msg });
      const conf = get('autounmute') || {};
      conf[msg.key.remoteJid] = time;
      set('autounmute', conf);
      const box = createBox('ᴀᴜᴛᴏ ᴜɴᴍᴜᴛᴇ', [formatLine('ᴛɪᴍᴇ', time), formatLine('sᴛᴀᴛᴜs', 'sᴇᴛ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
