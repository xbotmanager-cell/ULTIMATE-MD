import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'ephemeral',
  alias: ['eph'],
  desc: 'ᴛᴏɢɢʟᴇ ᴅɪsᴀᴘᴘᴇᴀʀɪɴɢ ᴍsɢ',
  category: 'group',
  react: '⏳',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const time = parseInt(args[0]) || 0;
      await sock.sendMessage(msg.key.remoteJid, { ephemeralExpiration: time });
      
      const box = createBox('ᴇᴘʜᴇᴍᴇʀᴀʟ', [
        formatLine('ᴛɪᴍᴇ', time ? `${time}s` : 'ᴏғғ')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
