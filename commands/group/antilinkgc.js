import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antilinkgc',
  alias: ['alg'],
  desc: 'ʙʟᴏᴄᴋ ɢʀᴏᴜᴘ ʟɪɴᴋs',
  category: 'group',
  react: '⛓️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('antilinkgc') || {};
      let state = args[0] === 'on' ? true : (args[0] === 'off' ? false : !conf[msg.key.remoteJid]);
      conf[msg.key.remoteJid] = state;
      set('antilinkgc', conf);
      
      const box = createBox('ᴀɴᴛɪ ʟɪɴᴋ ɢᴄ', [
        formatLine('sᴛᴀᴛᴜs', state ? 'ᴏɴ' : 'ᴏғғ')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
    }
  }
};
