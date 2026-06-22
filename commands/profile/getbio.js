import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'getbio',
  desc: 'Profile utility command for getbio',
  category: 'profile',
  execute: async (sock, msg, args) => {
      const isOwner = msg.key.fromMe || msg.key.participant?.startsWith(get('owner') || sock.user.id.split(':')[0]) || msg.key.remoteJid?.startsWith(get('owner') || sock.user.id.split(':')[0]);
      
      const botname = get('botname') || 'ULTIMATE-MD';
      if (!isOwner && 'getbio'.includes('bot')) return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });

      try {
         const box = createBox(botname, [
            formatLine('ᴀᴄᴛɪᴏɴ', 'getbio'),
            formatLine('sᴛᴀᴛᴜs', 'Executed successfully')
         ]);
         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error executing profile command.' });
      }
  }
};
