import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antimention',
  alias: ['amention'],
  desc: 'ʙʟᴏᴄᴋ ᴍᴇɴᴛɪᴏɴs',
  category: 'group',
  react: '@️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      let charLimit = 10;
      const conf = get('antimention') || {};
      if (args[0] === 'off') {
         conf[msg.key.remoteJid] = false;
      } else if (!isNaN(parseInt(args[0]))) {
         charLimit = parseInt(args[0]);
         conf[msg.key.remoteJid] = charLimit;
      } else {
         conf[msg.key.remoteJid] = conf[msg.key.remoteJid] ? false : charLimit;
      }
      set('antimention', conf);
      const stateStr = conf[msg.key.remoteJid] ? `Max Tags: ${conf[msg.key.remoteJid]}` : 'OFF';
      const box = createBox('ᴀɴᴛɪ ᴍᴇɴᴛɪᴏɴ', [formatLine('sᴛᴀᴛᴜs', stateStr)]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
