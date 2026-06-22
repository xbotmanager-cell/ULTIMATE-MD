import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'setprefix',
  desc: 'Change bot prefix in database',
  category: 'settings',
  execute: async (sock, msg, args) => {
      const isOwner = msg.key.fromMe || msg.key.participant?.startsWith(get('owner') || sock.user.id.split(':')[0]) || msg.key.remoteJid?.startsWith(get('owner') || sock.user.id.split(':')[0]);
      if (!isOwner && 'setprefix' !== 'settings') return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });
      
      if (!args[0]) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a new prefix!' });
      set('prefix', args[0]);
      sock.sendMessage(msg.key.remoteJid, { text: `Prefix updated to: ${args[0]}` });
  
  }
};
