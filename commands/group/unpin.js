import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'unpin',
  alias: ['upmsg'],
  desc: 'ᴜɴᴘɪɴ ᴍᴇssᴀɢᴇ',
  category: 'group',
  react: '📍',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      if (!msg.message?.extendedTextMessage?.contextInfo?.stanzaId) {
         return sock.sendMessage(msg.key.remoteJid, { text: 'Reply to a message to unpin it.' }, { quoted: msg });
      }
      const targetId = msg.message.extendedTextMessage.contextInfo.stanzaId;
      const targetJid = msg.message.extendedTextMessage.contextInfo.participant || msg.key.remoteJid;
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

      await sock.relayMessage(msg.key.remoteJid, {
         pinInChatMessage: { key: { remoteJid: msg.key.remoteJid, fromMe: targetJid === botNumber, id: targetId, participant: targetJid }, type: 2 }
      }, {});
      
      const box = createBox('ᴍsɢ ᴜɴᴘɪɴɴᴇᴅ', [formatLine('sᴛᴀᴛᴜs', 'Unpinned')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
