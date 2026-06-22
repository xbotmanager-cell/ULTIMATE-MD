import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'delwarn',
  alias: ['dw'],
  desc: 'ʀᴇᴍᴏᴠᴇ ᴡᴀʀɴ',
  category: 'group',
  react: '🧽',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const sender = msg.key.participant || msg.key.remoteJid;
      
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      const { isOwner } = await import('../../lib/sudo.js');\n      const realIsAdmin = admins.includes(sender) || isOwner(sock, msg, sender);

      if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'Nice try but you need admin powers for that!' }, { quoted: msg });
      
      let target = msg.message?.extendedTextMessage?.contextInfo?.participant;
      if (!target && msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      if (!target && args[0]) target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'Whom to remove warn?' }, { quoted: msg });
      
      const warns = get('warns') || {};
      if (warns[msg.key.remoteJid] && warns[msg.key.remoteJid][target]) {
         warns[msg.key.remoteJid][target] = Math.max(0, warns[msg.key.remoteJid][target] - 1);
         set('warns', warns);
      }
      
      const box = createBox('ᴡᴀʀɴ ʀᴇᴍᴏᴠᴇᴅ', [
        formatLine('ᴜsᴇʀ', `@${target.split('@')[0]}`),
        formatLine('sᴛᴀᴛᴜs', 'Forgiven but not forgotten.')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box, mentions: [target] }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived!' }, { quoted: msg });
    }
  }
};
