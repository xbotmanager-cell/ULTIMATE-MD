import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'gchidetag',
  alias: ['ht'],
  desc: 'sɪʟᴇɴᴛ ᴍᴇɴᴛɪᴏɴ',
  category: 'group',
  react: '👻',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const sender = msg.key.participant || msg.key.remoteJid;
      
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      const { isOwner } = await import('../../lib/sudo.js');\n      const realIsAdmin = admins.includes(sender) || isOwner(sock, msg, sender);

      if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'Nice try but you need admin powers for that!' }, { quoted: msg });
      
      const members = groupMetadata.participants.map(p => p.id);
      const mText = args.join(' ') || 'Ghost alert!';
      const box = createBox('sɪʟᴇɴᴛ ᴀʟᴇʀᴛ', [
        formatLine('ᴍsɢ', mText),
        formatLine('sᴛᴀᴛᴜs', 'Spooky season.')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box, mentions: members }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived!' }, { quoted: msg });
    }
  }
};
