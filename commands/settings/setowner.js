import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'setowner',
  desc: 'Change owner number in database',
  category: 'settings',
  execute: async (sock, msg, args) => {
      const sender = msg.key.participant || msg.key.remoteJid;
      const ownerCheck = isOwner(sock, msg, sender);
      if (!ownerCheck && 'setowner' !== 'settings') return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });
      
      if (!args[0]) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a new owner number! (e.g. 1234567890)' });
      set('owner', args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net');
      sock.sendMessage(msg.key.remoteJid, { text: `Owner updated to: ${args[0]}` });
  
  }
};
