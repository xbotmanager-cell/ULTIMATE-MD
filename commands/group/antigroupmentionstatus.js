import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antigroupmentionstatus',
  alias: ['agmstatus'],
  desc: 'ɢʀᴏᴜᴘ ᴍᴇɴᴛɪᴏɴ sᴛᴀᴛᴜs',
  category: 'group',
  react: '👁️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('agmstatus') || {};
      let state = args[0] === 'on' ? true : (args[0] === 'off' ? false : !conf[msg.key.remoteJid]);
      conf[msg.key.remoteJid] = state;
      set('agmstatus', conf);
      
      const box = createBox('ᴀɢᴍ sᴛᴀᴛᴜs', [
        formatLine('sᴛᴀᴛᴜs', state ? 'ᴏɴ' : 'ᴏғғ')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
