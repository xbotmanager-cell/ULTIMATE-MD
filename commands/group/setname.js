import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'setname',
  alias: ['sn'],
  desc: 'ᴄʜᴀɴɢᴇ ɢʀᴏᴜᴘ ɴᴀᴍᴇ',
  category: 'group',
  react: '✏️',
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
      
      const newName = args.join(' ');
      if (!newName) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a new name.' }, { quoted: msg });
      await sock.groupUpdateSubject(msg.key.remoteJid, newName);
      
      const box = createBox('ɴᴀᴍᴇ ᴄʜᴀɴɢᴇᴅ', [
        formatLine('ᴏʟᴅ', groupMetadata.subject),
        formatLine('ɴᴇᴡ', newName),
        formatLine('sᴛᴀᴛᴜs', 'Looking fresh!')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived!' }, { quoted: msg });
    }
  }
};
