import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antiedit',
  alias: ['aedit'],
  desc: 'sʜᴏᴡ ᴇᴅɪᴛs',
  category: 'group',
  react: '✍️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const list = get('gcantiedit') || [];
      const index = list.indexOf(msg.key.remoteJid);
      let state = false;
      if (args[0] === 'on') { state = true; if(index === -1) list.push(msg.key.remoteJid); }
      else if (args[0] === 'off') { state = false; if(index > -1) list.splice(index, 1); }
      else {
         if (index > -1) { list.splice(index, 1); state = false; }
         else { list.push(msg.key.remoteJid); state = true; }
      }
      set('gcantiedit', list);
      const box = createBox('ᴀɴᴛɪ ᴇᴅɪᴛ', [formatLine('sᴛᴀᴛᴜs', state ? 'ᴏɴ' : 'ᴏғғ')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
