import { createBox, formatLine } from '../../system/box.js';

export default {
  name: 'totalmembers',
  alias: ['members'],
  desc: 'ᴄᴏᴜɴᴛ ᴍᴇᴍʙᴇʀs',
  category: 'group',
  react: '👥',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      
      const box = createBox('ᴍᴇᴍʙᴇʀs', [
        formatLine('ᴛᴏᴛᴀʟ', `${groupMetadata.participants.length}`)
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
