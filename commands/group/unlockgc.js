import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'unlockgc',
  alias: ['unlock'],
  desc: 'ᴜɴʟᴏᴄᴋ ɢʀᴏᴜᴘ sᴇᴛᴛɪɴɢs',
  category: 'group',
  react: '🔓',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      await sock.groupSettingUpdate(msg.key.remoteJid, 'unlocked');
      const box = createBox('ɢʀᴏᴜᴘ ɪɴғᴏ', [formatLine('sᴛᴀᴛᴜs', 'ᴜɴʟᴏᴄᴋᴇᴅ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
