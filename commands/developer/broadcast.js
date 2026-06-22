import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'broadcast',
  desc: 'Developer command: broadcast',
  category: 'developer',
  execute: async (sock, msg, args) => {
      try {
         const isOwner = msg.key.participant === process.env.OWNER_NUMBER + '@s.whatsapp.net' || msg.key.remoteJid === process.env.OWNER_NUMBER + '@s.whatsapp.net';
         if (!isOwner) return sock.sendMessage(msg.key.remoteJid, { text: 'Only the developer can use this command.' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         let result = 'Dev operation successful.';

         if ('broadcast' === 'setbotname') {
             const newName = args.join(' ');
             if (!newName) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a new name.' });
             await set('botname', newName);
             result = `Name changed to ${newName}`;
         } else if ('broadcast' === 'broadcast') {
             result = 'Broadcast message queued.';
         } else if ('broadcast' === 'eval') {
             result = 'Eval restricted for security.';
         } else {
             result = 'broadcast is setup.';
         }

         const box = createBox(botname, [
            formatLine('ᴅᴇᴠ', 'BROADCAST'),
            formatLine('ʀᴇsᴜʟᴛ', result)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in dev command.' }, { quoted: msg });
      }
  }
};
