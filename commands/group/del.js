import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'del',
  alias: ['delete'],
  desc: 'ᴅᴇʟᴇᴛᴇ ᴍsɢ',
  category: 'group',
  react: '🗑️',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      if (!msg.message?.extendedTextMessage?.contextInfo?.stanzaId) {
         return sock.sendMessage(msg.key.remoteJid, { text: 'Reply to a message to delete it.' }, { quoted: msg });
      }
      const targetId = msg.message.extendedTextMessage.contextInfo.stanzaId;
      const targetJid = msg.message.extendedTextMessage.contextInfo.participant || msg.key.remoteJid;
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      
      await sock.sendMessage(msg.key.remoteJid, { delete: { remoteJid: msg.key.remoteJid, fromMe: targetJid === botNumber, id: targetId, participant: targetJid } });
      const box = createBox('ᴍsɢ ᴅᴇʟᴇᴛᴇᴅ', [formatLine('sᴛᴀᴛᴜs', 'Poof')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
