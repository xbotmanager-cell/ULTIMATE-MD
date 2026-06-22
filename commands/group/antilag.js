import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antilag',
  alias: ['alag'],
  desc: 'ʙʟᴏᴄᴋ ʟᴀɢ ᴍsɢs',
  category: 'group',
  react: '🥶',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('antilag') || {};
      const state = args[0] === 'on' ? true : (args[0] === 'off' ? false : !conf[msg.key.remoteJid]);
      conf[msg.key.remoteJid] = state;
      set('antilag', conf);
      const box = createBox('ᴀɴᴛɪ ʟᴀɢ', [formatLine('sᴛᴀᴛᴜs', state ? 'ᴏɴ' : 'ᴏғғ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
