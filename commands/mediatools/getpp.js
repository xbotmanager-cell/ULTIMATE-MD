import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'getpp',
  desc: 'Get profile picture by number, tag, or reply.',
  category: 'mediatools',
  execute: async (sock, msg, args) => {
      try {
         let target = msg.key.remoteJid;
         
         const isGroup = msg.key.remoteJid.endsWith('@g.us');
         if (isGroup) {
             const m = msg.message.conversation || msg.message.extendedTextMessage?.text;
             if (msg.message.extendedTextMessage?.contextInfo?.participant) {
                 target = msg.message.extendedTextMessage.contextInfo.participant;
             } else if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                 target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
             } else if (args.length > 0) {
                 target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
             }
         } else if (args.length > 0) {
             target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
         }

         try {
             const ppUrl = await sock.profilePictureUrl(target, 'image');
             const botname = get('botname') || 'ULTIMATE-MD';
             const caption = createBox(botname, [
                 formatLine('ᴛᴏᴏʟ', 'GET PROFILE PIC'),
                 formatLine('ᴛᴀʀɢᴇᴛ', target.split('@')[0])
             ]);
             await sock.sendMessage(msg.key.remoteJid, { image: { url: ppUrl }, caption }, { quoted: msg });
         } catch (e) {
             await sock.sendMessage(msg.key.remoteJid, { text: 'No profile picture found or privacy restricted.' }, { quoted: msg });
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error executing getpp.' });
      }
  }
};
