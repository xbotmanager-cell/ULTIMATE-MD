import { createBox, formatLine } from '../../system/box.js';

export default {
  name: 'groupinfo',
  alias: ['ginfo'],
  desc: 'sʜᴏᴡ ɢʀᴏᴜᴘ ɪɴғᴏ',
  category: 'group',
  react: 'ℹ️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      
      const box = createBox('ɢʀᴏᴜᴘ ɪɴғᴏ', [
        formatLine('ɴᴀᴍᴇ', groupMetadata.subject),
        formatLine('ᴍᴇᴍʙᴇʀs', `${groupMetadata.participants.length}`),
        formatLine('ᴏᴡɴᴇʀ', groupMetadata.owner ? groupMetadata.owner.split('@')[0] : 'Unknown')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
