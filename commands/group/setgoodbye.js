import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'setgoodbye',
  alias: ['sg'],
  desc: 'sᴇᴛ ɢᴏᴏᴅʙʏᴇ ᴍsɢ',
  category: 'group',
  react: '👋',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const text = args.join(' ');
      if(!text) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide message with @user placeholder.' }, { quoted: msg });
      const conf = get('goodbye') || {};
      conf[msg.key.remoteJid] = text;
      set('goodbye', conf);
      const box = createBox('ɢᴏᴏᴅʙʏᴇ sᴇᴛ', [formatLine('sᴛᴀᴛᴜs', 'Final words saved')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
