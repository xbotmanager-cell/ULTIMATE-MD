import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'grouplist',
  alias: ['gls'],
  desc: 'ʟɪsᴛ ᴀʟʟ ɢʀᴏᴜᴘs',
  category: 'group',
  react: '📋',
  execute: async (sock, msg, args) => {
    try {
      if (!msg.key.fromMe && !msg.key.participant.startsWith(get('owner') || 'some')) return;
      
      const chats = await sock.groupFetchAllParticipating();
      const groups = Object.values(chats);
      
      let text = '╭─━━━━━━━━━━━━━━━━━─╮\n│   📋 ɢʀᴏᴜᴘ ʟɪsᴛ 📋\n├─━━━━━━━━━━━━━━━━━─┤\n';
      groups.forEach((g, i) => {
          text += `│ ${i+1}. ${g.subject}\n`;
      });
      text += '╰─━━━━━━━━━━━━━━━━━─╯';
      
      return sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
