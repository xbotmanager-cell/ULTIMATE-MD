import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'setprefix',
  alias: ['spx'],
  desc: 'sᴇᴛ ɢʀᴏᴜᴘ ᴘʀᴇғɪx',
  category: 'group',
  react: '❗',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('prefixes') || {};
      const prefix = args[0];
      if (!prefix) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a prefix symbol.' }, { quoted: msg });
      
      conf[msg.key.remoteJid] = prefix;
      set('prefixes', conf);
      const box = createBox('ɢʀᴏᴜᴘ ᴘʀᴇғɪx', [formatLine('ɴᴇᴡ', prefix)]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
