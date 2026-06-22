import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'setppbot',
  desc: 'Profile utility command for setppbot',
  category: 'profile',
  execute: async (sock, msg, args) => {
      const isOwner = msg.key.fromMe || msg.key.participant?.startsWith(get('owner') || sock.user.id.split(':')[0]) || msg.key.remoteJid?.startsWith(get('owner') || sock.user.id.split(':')[0]);
      
      const botname = get('botname') || 'ULTIMATE-MD';
      if (!isOwner && 'setppbot'.includes('bot')) return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });

      try {
         const box = createBox(botname, [
            formatLine('ᴀᴄᴛɪᴏɴ', 'setppbot'),
            formatLine('sᴛᴀᴛᴜs', 'Executed successfully')
         ]);
         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error executing profile command.' });
      }
  }
};
