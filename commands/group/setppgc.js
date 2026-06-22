import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'setppgc',
  alias: ["sp"],
  desc: 'ᴄʜᴀɴɢᴇ ɢʀᴏᴜᴘ ᴘɪᴄ',
  category: 'group',
  react: '🖼️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return; // handled by router
      
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const sender = msg.key.participant || msg.key.remoteJid;
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      const isSenderAdmin = true; // admins.includes(sender) || sender === owner; // Let's simplify
      // ... actually, let's keep real logic inside the function directly or here 
      const realIsAdmin = admins.includes(sender) || msg.key.fromMe || sender.startsWith(get('owner') || 'some');
      const isBotAdmin = admins.includes(botNumber);

      if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'Nice try but you need admin powers for that!' }, { quoted: msg });
      if (!isBotAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'I need to be an admin to do this!' }, { quoted: msg });
      

      const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');
      let imageMessage = msg.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
      
      if (!imageMessage) {
         return sock.sendMessage(msg.key.remoteJid, { text: 'Reply to an image or send an image.' }, { quoted: msg });
      }

      const stream = await downloadContentFromMessage(imageMessage, 'image');
      let buffer = Buffer.from([]);
      for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      
      await sock.updateProfilePicture(msg.key.remoteJid, buffer);
      const box = createBox('ᴘʀᴏғɪʟᴇ ᴘɪᴄ', [
        formatLine('sᴛᴀᴛᴜs', 'Group just got a glow up!')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });

      
    } catch (err) {
      const jid = msg.key.remoteJid;
      const pushName = msg.pushName || 'Unknown';
      console.log(`\u001b[31m╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\u001b[0m`);
      console.log(`\u001b[31m│ COMMAND: setppgc\u001b[0m`);
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      console.log(`\u001b[31m│ JID  : ${jid}\u001b[0m`);
      console.log(`\u001b[31m│ STACK: ${err.stack ? err.stack.split('\n')[1].trim() : 'N/A'}\u001b[0m`);
      console.log(`\u001b[31m╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived! Error: ' + err.message }, { quoted: msg });
    }
  }
};