import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'poll',
  alias: ['vote'],
  desc: 'ᴄʀᴇᴀᴛᴇ ᴘᴏʟʟ',
  category: 'group',
  react: '📊',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const parts = args.join(' ').split('|');
      if(parts.length < 3) return sock.sendMessage(msg.key.remoteJid, { text: 'Format: question | option1 | option2' }, { quoted: msg });
      
      const name = parts[0];
      const values = parts.slice(1).map(s => s.trim());
      
      await sock.sendMessage(msg.key.remoteJid, {
          poll: {
              name,
              values,
              selectableCount: 1
          }
      });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
