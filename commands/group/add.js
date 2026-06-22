import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'add',
  alias: ['a'],
  desc: 'ᴀᴅ ᴍᴇᴍʙᴇʀ',
  category: 'group',
  react: '➕',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const sender = msg.key.participant || msg.key.remoteJid;
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      const { isOwner } = await import('../../lib/sudo.js');\n      const realIsAdmin = admins.includes(sender) || isOwner(sock, msg, sender);
      const isBotAdmin = admins.includes(botNumber);

      if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'Nice try but you need admin powers for that!' }, { quoted: msg });
      if (!isBotAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'I need to be an admin to do this!' }, { quoted: msg });
      
      if (!args[0]) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a number to add.' }, { quoted: msg });
      const target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [target], 'add');
      
      const box = createBox('ᴍᴇᴍʙᴇʀ ᴀᴅᴅᴇᴅ', [
        formatLine('ᴜsᴇʀ', `@${target.split('@')[0]}`),
        formatLine('ʙʏ', `@${sender.split('@')[0]}`),
        formatLine('sᴛᴀᴛᴜs', 'Welcome to the club!')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box, mentions: [target, sender] }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived!' }, { quoted: msg });
    }
  }
};
