import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'setbotname',
  desc: 'Change bot name in database',
  category: 'settings',
  execute: async (sock, msg, args) => {
      const sender = msg.key.participant || msg.key.remoteJid;
      const ownerCheck = isOwner(sock, msg, sender);
      if (!ownerCheck && 'setbotname' !== 'settings') return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });
      
      if (!args[0]) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a new bot name!' });
      set('botname', args.join(' '));
      sock.sendMessage(msg.key.remoteJid, { text: `Bot name updated to: ${args.join(' ')}` });
  
  }
};
