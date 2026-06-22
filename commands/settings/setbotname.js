import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'setbotname',
  desc: 'Change bot name in database',
  category: 'settings',
  execute: async (sock, msg, args) => {
      const isOwner = msg.key.fromMe || msg.key.participant?.startsWith(get('owner') || sock.user.id.split(':')[0]) || msg.key.remoteJid?.startsWith(get('owner') || sock.user.id.split(':')[0]);
      if (!isOwner && 'setbotname' !== 'settings') return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });
      
      if (!args[0]) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a new bot name!' });
      set('botname', args.join(' '));
      sock.sendMessage(msg.key.remoteJid, { text: `Bot name updated to: ${args.join(' ')}` });
  
  }
};
