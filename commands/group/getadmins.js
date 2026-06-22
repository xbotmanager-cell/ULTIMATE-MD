import { createBox, formatLine } from '../../system/box.js';

export default {
  name: 'getadmins',
  alias: ['admins'],
  desc: 'ʟɪsᴛ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs',
  category: 'group',
  react: '👔',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      
      let text = '╭─━━━━━━━━━━━━━━━━━─╮\n│   👔 ᴀᴅᴍɪɴs 👔\n├─━━━━━━━━━━━━━━━━━─┤\n';
      admins.forEach((g) => {
          text += `│ ◦ @${g.split('@')[0]}\n`;
      });
      text += '╰─━━━━━━━━━━━━━━━━━─╯';
      
      return sock.sendMessage(msg.key.remoteJid, { text, mentions: admins }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
