import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'togglewelcome',
  alias: ['tw'],
  desc: 'ᴏɴ ᴏғ ᴡᴇʟᴄᴏᴍᴇ',
  category: 'group',
  react: '🔔',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('toggles') || {};
      conf.welcome = conf.welcome || {};
      const state = args[0] === 'on' ? true : (args[0] === 'off' ? false : !conf.welcome[msg.key.remoteJid]);
      conf.welcome[msg.key.remoteJid] = state;
      set('toggles', conf);
      const box = createBox('ᴡᴇʟᴄᴏᴍᴇ ᴍsɢ', [formatLine('sᴛᴀᴛᴜs', state ? 'ᴏɴ' : 'ᴏғғ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
