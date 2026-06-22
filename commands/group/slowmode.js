import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'slowmode',
  alias: ['slow'],
  desc: 'sᴇᴛ ᴍsɢ ᴅᴇʟᴀʏ',
  category: 'group',
  react: '🐌',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('slowmode') || {};
      const val = parseInt(args[0]);
      if (isNaN(val)) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide delay in seconds.' }, { quoted: msg });
      
      conf[msg.key.remoteJid] = val;
      set('slowmode', conf);
      const box = createBox('sʟᴏᴡᴍᴏᴅᴇ', [formatLine('ᴅᴇʟᴀʏ', `${val}s`), formatLine('sᴛᴀᴛᴜs', 'sᴇᴛ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
