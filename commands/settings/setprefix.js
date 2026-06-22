import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'setprefix',
  desc: 'Change bot prefix in database',
  category: 'settings',
  execute: async (sock, msg, args) => {
      const sender = msg.key.participant || msg.key.remoteJid;
      const ownerCheck = isOwner(sock, msg, sender);
      if (!ownerCheck && 'setprefix' !== 'settings') return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });
      
      if (!args[0]) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a new prefix!' });
      set('prefix', args[0]);
      sock.sendMessage(msg.key.remoteJid, { text: `Prefix updated to: ${args[0]}` });
  
  }
};
