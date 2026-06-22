import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'setwelcome',
  alias: ['sw'],
  desc: 'sᴇᴛ ᴡᴇʟᴄᴏᴍᴇ ᴍsɢ',
  category: 'group',
  react: '👋',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const text = args.join(' ');
      if(!text) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide message with @user placeholder.' }, { quoted: msg });
      const conf = get('welcome') || {};
      conf[msg.key.remoteJid] = text;
      set('welcome', conf);
      const box = createBox('ᴡᴇʟᴄᴏᴍᴇ sᴇᴛ', [formatLine('sᴛᴀᴛᴜs', 'Ready to greet')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
