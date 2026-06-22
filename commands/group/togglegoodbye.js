import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'togglegoodbye',
  alias: ['tg'],
  desc: 'ᴏɴ ᴏғғ ɢᴏᴏᴅʙʏᴇ',
  category: 'group',
  react: '🔕',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('toggles') || {};
      conf.goodbye = conf.goodbye || {};
      const state = args[0] === 'on' ? true : (args[0] === 'off' ? false : !conf.goodbye[msg.key.remoteJid]);
      conf.goodbye[msg.key.remoteJid] = state;
      set('toggles', conf);
      const box = createBox('ɢᴏᴏᴅʙʏᴇ ᴍsɢ', [formatLine('sᴛᴀᴛᴜs', state ? 'ᴏɴ' : 'ᴏғғ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
