import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'lockgc',
  alias: ['lock'],
  desc: 'ʟᴏᴄᴋ ɢʀᴏᴜᴘ sᴇᴛɪɴɢs',
  category: 'group',
  react: '🔒',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      await sock.groupSettingUpdate(msg.key.remoteJid, 'locked');
      const box = createBox('ɢʀᴏᴜᴘ ɪɴғᴏ', [formatLine('sᴛᴀᴛᴜs', 'ʟᴏᴄᴋᴇᴅ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
