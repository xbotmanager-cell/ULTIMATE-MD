import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'rules',
  alias: ['r'],
  desc: 'sʜᴏᴡ ɢʀᴏᴜᴘ ʀᴜʟᴇs',
  category: 'group',
  react: '📖',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const conf = get('rules') || {};
      const rules = conf[msg.key.remoteJid] || 'No rules configured yet.';
      const box = createBox('ɢʀᴏᴜᴘ ʀᴜʟᴇs', [formatLine('ʀᴜʟᴇs', rules)]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
