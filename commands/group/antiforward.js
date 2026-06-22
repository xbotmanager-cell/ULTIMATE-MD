import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antiforward',
  alias: ['aforward'],
  desc: 'ʙʟᴏᴄᴋ ғᴏʀᴡᴀʀᴅs',
  category: 'group',
  react: '⏩',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      let charLimit = 5;
      const conf = get('antiforward') || {};
      if (args[0] === 'off') {
         conf[msg.key.remoteJid] = false;
      } else if (!isNaN(parseInt(args[0]))) {
         charLimit = parseInt(args[0]);
         conf[msg.key.remoteJid] = charLimit;
      } else {
         conf[msg.key.remoteJid] = conf[msg.key.remoteJid] ? false : charLimit;
      }
      set('antiforward', conf);
      const stateStr = conf[msg.key.remoteJid] ? `Max Score: ${conf[msg.key.remoteJid]}` : 'OFF';
      const box = createBox('ᴀɴᴛɪ ғᴏʀᴡᴀʀᴅ', [formatLine('sᴛᴀᴛᴜs', stateStr)]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
