import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antilong',
  alias: ['along'],
  desc: 'ʙʟᴏᴄᴋ ʟᴏɴɢ ᴍsɢs',
  category: 'group',
  react: '📏',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      let charLimit = 500;
      const conf = get('antilong') || {};
      if (args[0] === 'off') {
         conf[msg.key.remoteJid] = false;
      } else if (!isNaN(parseInt(args[0]))) {
         charLimit = parseInt(args[0]);
         conf[msg.key.remoteJid] = charLimit;
      } else {
         conf[msg.key.remoteJid] = conf[msg.key.remoteJid] ? false : charLimit;
      }
      set('antilong', conf);
      const stateStr = conf[msg.key.remoteJid] ? `Limit: ${conf[msg.key.remoteJid]} chars` : 'OFF';
      const box = createBox('ᴀɴᴛɪ ʟᴏɴɢ', [formatLine('sᴛᴀᴛᴜs', stateStr)]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
