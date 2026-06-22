import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'pin',
  alias: ['pmsg'],
  desc: 'ᴘɪɴ ᴍᴇssᴀɢᴇ',
  category: 'group',
  react: '📌',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      if (!msg.message?.extendedTextMessage?.contextInfo?.stanzaId) {
         return sock.sendMessage(msg.key.remoteJid, { text: 'Reply to a message to pin it.' }, { quoted: msg });
      }
      const targetId = msg.message.extendedTextMessage.contextInfo.stanzaId;
      const targetJid = msg.message.extendedTextMessage.contextInfo.participant || msg.key.remoteJid;
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      
      const time = args[0] === '7d' ? 604800 : (args[0] === '30d' ? 2592000 : 86400);

      await sock.relayMessage(msg.key.remoteJid, {
         pinInChatMessage: { key: { remoteJid: msg.key.remoteJid, fromMe: targetJid === botNumber, id: targetId, participant: targetJid }, type: 1, time: time }
      }, {});
      
      const box = createBox('ᴍsɢ ᴘɪɴɴᴇᴅ', [formatLine('sᴛᴀᴛᴜs', 'Pinned')]);
      return sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
    } catch (err) { }
  }
};
