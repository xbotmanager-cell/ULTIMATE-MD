import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'setrules',
  alias: ['sr'],
  desc: 'sᴇᴛ ɢʀᴏᴜᴘ ʀᴜʟᴇs',
  category: 'group',
  react: '📜',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const text = args.join(' ');
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide the rules text.' }, { quoted: msg });
      const conf = get('rules') || {};
      conf[msg.key.remoteJid] = text;
      set('rules', conf);
      const box = createBox('ɢʀᴏᴜᴘ ʀᴜʟᴇs', [formatLine('sᴛᴀᴛᴜs', 'sᴇᴛ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
