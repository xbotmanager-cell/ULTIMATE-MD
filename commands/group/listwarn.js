import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'listwarn',
  alias: ['lw'],
  desc: 'sʜᴏᴡ ᴡᴀʀɴ ʟɪsᴛ',
  category: 'group',
  react: '📜',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const warns = get('warns') || {};
      const gWarns = warns[msg.key.remoteJid] || {};
      const keys = Object.keys(gWarns);
      
      if (keys.length === 0) {
        return sock.sendMessage(msg.key.remoteJid, { text: 'No bad boys in here.' }, { quoted: msg });
      }
      
      let text = '╭─━━━━━━━━━━━━━━━━━─╮\n│   📜 ᴡᴀʀɴ ʟɪsᴛ 📜\n├─━━━━━━━━━━━━━━━━━─┤\n';
      for(let mem of keys) {
          text += `│ ◦ @${mem.split('@')[0]} : ${gWarns[mem]}/3\n`;
      }
      text += '╰─━━━━━━━━━━━━━━━━━─╯';
      return sock.sendMessage(msg.key.remoteJid, { text: text, mentions: keys }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
