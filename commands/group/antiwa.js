import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antiwa',
  alias: ['awa'],
  desc: 'ʙʟᴏᴄᴋ ᴡᴀ ᴍᴏᴅs',
  category: 'group',
  react: '📱',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('antiwa') || {};
      const state = args[0] === 'on' ? true : (args[0] === 'off' ? false : !conf[msg.key.remoteJid]);
      conf[msg.key.remoteJid] = state;
      set('antiwa', conf);
      const box = createBox('ᴀɴᴛɪ ᴡᴀ ᴍᴏᴅs', [formatLine('sᴛᴀᴛᴜs', state ? 'ᴏɴ' : 'ᴏғғ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
