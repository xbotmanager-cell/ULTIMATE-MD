import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'getprefix',
  alias: ['gpx'],
  desc: 'sʜᴏᴡ ɢʀᴏᴜᴘ ᴘʀᴇғɪx',
  category: 'group',
  react: '❔',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('prefixes') || {};
      const prefix = conf[msg.key.remoteJid] || get('prefix') || '.';
      const box = createBox('ɢʀᴏᴜᴘ ᴘʀᴇғɪx', [formatLine('ᴄᴜʀʀᴇɴᴛ', prefix)]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
