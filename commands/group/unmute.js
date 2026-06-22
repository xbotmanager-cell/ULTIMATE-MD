import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'unmute',
  alias: ['um'],
  desc: 'ᴜɴᴍᴜᴛᴇ ᴍᴇᴍʙᴇʀ',
  category: 'group',
  react: '🔊',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const sender = msg.key.participant || msg.key.remoteJid;
      
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      const realIsAdmin = admins.includes(sender) || msg.key.fromMe || sender.startsWith(get('owner') || 'some');

      if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'Nice try but you need admin powers for that!' }, { quoted: msg });
      
      let target = msg.message?.extendedTextMessage?.contextInfo?.participant;
      if (!target && msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      if (!target && args[0]) target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'Whom to unmute?' }, { quoted: msg });
      
      const mutes = get('mutes') || {};
      if (mutes[msg.key.remoteJid] && mutes[msg.key.remoteJid][target]) {
         delete mutes[msg.key.remoteJid][target];
         set('mutes', mutes);
      }
      
      const box = createBox('ᴍᴇᴍʙᴇʀ ᴜɴᴍᴜᴛᴇᴅ', [
        formatLine('ᴜsᴇʀ', `@${target.split('@')[0]}`),
        formatLine('sᴛᴀᴛᴜs', 'Can speak again.')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box, mentions: [target] }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived!' }, { quoted: msg });
    }
  }
};
