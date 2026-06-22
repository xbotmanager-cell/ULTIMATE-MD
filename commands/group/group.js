import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'group',
  alias: ['g'],
  desc: 'ᴏᴘᴇɴ ᴄʟᴏsᴇ ɢʀᴏᴜᴘ',
  category: 'group',
  react: '🚪',
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
      
      if (args[0] === 'open') {
        await sock.groupSettingUpdate(msg.key.remoteJid, 'not_announcement');
        const box = createBox('ɢʀᴏᴜᴘ sᴛᴀᴛᴜs', [formatLine('sᴛᴀᴛᴜs', 'OPEN'), formatLine('ɪɴғᴏ', 'Gates are wide open!')]);
        return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } else if (args[0] === 'close') {
        await sock.groupSettingUpdate(msg.key.remoteJid, 'announcement');
        const box = createBox('ɢʀᴏᴜᴘ sᴛᴀᴛᴜs', [formatLine('sᴛᴀᴛᴜs', 'CLOSED'), formatLine('ɪɴғᴏ', 'Hold the door!')]);
        return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } else {
        return sock.sendMessage(msg.key.remoteJid, { text: 'Use g open or g close' }, { quoted: msg });
      }
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived!' }, { quoted: msg });
    }
  }
};
