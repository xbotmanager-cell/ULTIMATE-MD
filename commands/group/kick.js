import { get } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'kick',
  alias: ['remove'],
  desc: 'Removes a user from the group',
  category: 'group',
  react: '👢',
  execute: async (sock, msg, args) => {
      try {
         const sender = msg.key.participant || msg.key.remoteJid;
         const ownerCheck = isOwner(sock, msg, sender);
         const groupMetadata = msg.key.remoteJid.endsWith('@g.us') ? await sock.groupMetadata(msg.key.remoteJid).catch(() => null) : null;
         
         if (!groupMetadata) return sock.sendMessage(msg.key.remoteJid, { text: 'This command only works in groups!' }, { quoted: msg });
         
         const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
         const realIsAdmin = admins.includes(sender) || ownerCheck;
         
         if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'You need admin privileges for this!' }, { quoted: msg });
         
         const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
         if (!admins.includes(botId)) return sock.sendMessage(msg.key.remoteJid, { text: 'I need to be an admin to kick someone!' }, { quoted: msg });

         let target = '';
         if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
         } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            target = msg.message.extendedTextMessage.contextInfo.participant;
         } else if (args[0]) {
            target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
         }

         if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'Mention/reply to the person you want to kick!' }, { quoted: msg });

         if (target === botId) return sock.sendMessage(msg.key.remoteJid, { text: 'I cannot kick myself!' }, { quoted: msg });
         
         if (admins.includes(target) && !ownerCheck) {
             return sock.sendMessage(msg.key.remoteJid, { text: 'Cannot kick another admin!' }, { quoted: msg });
         }

         await sock.groupParticipantsUpdate(msg.key.remoteJid, [target], 'remove');
         await sock.sendMessage(msg.key.remoteJid, { text: `👢 Bye bye @${target.split('@')[0]}`, mentions: [target] });

      } catch (e) {
          return sock.sendMessage(msg.key.remoteJid, { text: 'Failed to kick the user.' }, { quoted: msg });
      }
  }
};
