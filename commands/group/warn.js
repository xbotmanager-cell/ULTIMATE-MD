import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'warn',
  alias: ['w'],
  desc: 'ᴡᴀʀɴ ᴍᴇᴍʙᴇʀ',
  category: 'group',
  react: '⚠️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const sender = msg.key.participant || msg.key.remoteJid;
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      const realIsAdmin = admins.includes(sender) || msg.key.fromMe || sender.startsWith(get('owner') || 'some');
      const isBotAdmin = admins.includes(botNumber);

      if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'Nice try but you need admin powers for that!' }, { quoted: msg });
      if (!isBotAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'I need to be an admin to do this!' }, { quoted: msg });
      
      let target = msg.message?.extendedTextMessage?.contextInfo?.participant;
      if (!target && msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      if (!target && args[0]) target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'Whom to warn?' }, { quoted: msg });
      
      const warns = get('warns') || {};
      warns[msg.key.remoteJid] = warns[msg.key.remoteJid] || {};
      const current = (warns[msg.key.remoteJid][target] || 0) + 1;
      warns[msg.key.remoteJid][target] = current;
      set('warns', warns);
      
      if (current >= 3) {
         await sock.groupParticipantsUpdate(msg.key.remoteJid, [target], 'remove');
         delete warns[msg.key.remoteJid][target];
         set('warns', warns);
         const box = createBox('ᴡᴀʀɴ ʟɪᴍɪᴛ', [
            formatLine('ᴜsᴇʀ', `@${target.split('@')[0]}`),
            formatLine('sᴛᴀᴛᴜs', '3 strikes, you are out!')
         ]);
         return sock.sendMessage(msg.key.remoteJid, { text: box, mentions: [target] }, { quoted: msg });
      } else {
         const box = createBox('ᴡᴀʀɴ ɪssᴜᴇᴅ', [
            formatLine('ᴜsᴇʀ', `@${target.split('@')[0]}`),
            formatLine('ᴄᴏᴜɴᴛ', `${current}/3`),
            formatLine('sᴛᴀᴛᴜs', 'Walk the line.')
         ]);
         return sock.sendMessage(msg.key.remoteJid, { text: box, mentions: [target] }, { quoted: msg });
      }
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived!' }, { quoted: msg });
    }
  }
};
