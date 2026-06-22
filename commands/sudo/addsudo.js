import { addSudo, isOwner } from '../../lib/sudo.js';

export default {
  name: 'addsudo',
  desc: 'Adds a user to sudo list',
  category: 'sudo',
  react: '✅',
  execute: async (sock, msg, args) => {
      try {
         const sender = msg.key.participant || msg.key.remoteJid;
         const ownerCheck = isOwner(sock, msg, sender);
         if (!ownerCheck) return sock.sendMessage(msg.key.remoteJid, { text: 'Only the owner can use this command.' }, { quoted: msg });

         let target = '';
         if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
             target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
         } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
             target = msg.message.extendedTextMessage.contextInfo.participant;
         } else if (args[0]) {
             target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
         }

         if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'Mention/reply to the person to add as sudo!' });

         await addSudo(target);
         await sock.sendMessage(msg.key.remoteJid, { text: `✅ @${target.split('@')[0]} added to sudo list.`, mentions: [target] }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Failed to add sudo.' });
      }
  }
};
