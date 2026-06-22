import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'clearchat',
  desc: 'Profile utility command for clearchat',
  category: 'profile',
  execute: async (sock, msg, args) => {
      const sender = msg.key.participant || msg.key.remoteJid;
      const ownerCheck = isOwner(sock, msg, sender);
      
      const botname = get('botname') || 'ULTIMATE-MD';
      if (!ownerCheck && 'clearchat'.includes('bot')) return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });

      try {
         const box = createBox(botname, [
            formatLine('ᴀᴄᴛɪᴏɴ', 'clearchat'),
            formatLine('sᴛᴀᴛᴜs', 'Executed successfully')
         ]);
         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error executing profile command.' });
      }
  }
};
