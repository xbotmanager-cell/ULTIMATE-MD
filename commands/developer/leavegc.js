import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'leavegc',
  desc: 'Developer command: leavegc',
  category: 'developer',
  execute: async (sock, msg, args) => {
      try {
         const isOwner = msg.key.participant === process.env.OWNER_NUMBER + '@s.whatsapp.net' || msg.key.remoteJid === process.env.OWNER_NUMBER + '@s.whatsapp.net';
         if (!isOwner) return sock.sendMessage(msg.key.remoteJid, { text: 'Only the developer can use this command.' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         let result = 'Dev operation successful.';

         if ('leavegc' === 'setbotname') {
             const newName = args.join(' ');
             if (!newName) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a new name.' });
             await set('botname', newName);
             result = `Name changed to ${newName}`;
         } else if ('leavegc' === 'broadcast') {
             result = 'Broadcast message queued.';
         } else if ('leavegc' === 'eval') {
             result = 'Eval restricted for security.';
         } else {
             result = 'leavegc is setup.';
         }

         const box = createBox(botname, [
            formatLine('ᴅᴇᴠ', 'LEAVEGC'),
            formatLine('ʀᴇsᴜʟᴛ', result)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in dev command.' }, { quoted: msg });
      }
  }
};
