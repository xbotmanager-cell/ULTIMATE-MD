import { listSudo, isOwner } from '../../lib/sudo.js';

export default {
  name: 'listsudo',
  desc: 'Lists all system sudos',
  category: 'sudo',
  react: '📜',
  execute: async (sock, msg, args) => {
      try {
         const sender = msg.key.participant || msg.key.remoteJid;
         const ownerCheck = isOwner(sock, msg, sender);
         if (!ownerCheck) return sock.sendMessage(msg.key.remoteJid, { text: 'Only the owner can use this command.' }, { quoted: msg });

         const list = listSudo();
         let text = '📜 *SUDO LIST*\n\n';
         if (!list || !list.sudos || list.sudos.length === 0) text += 'No sudos found.';
         else {
             list.sudos.forEach((s, i) => {
                 text += `${i + 1}. @${s.split('@')[0]}\n`;
             });
         }
         
         await sock.sendMessage(msg.key.remoteJid, { text, mentions: list.sudos || [] }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Failed to list sudos.' });
      }
  }
};
