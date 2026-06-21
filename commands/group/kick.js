export default {
  name: 'kick',
  alias: ['remove'],
  desc: 'ʀᴇᴍᴏᴠᴇ ᴜsᴇʀ ғʀᴏᴍ ɢʀᴏᴜᴘ',
  category: 'group',
  react: '👢',
  execute: async (sock, msg, args) => {
    if (!msg.key.remoteJid.endsWith('@g.us')) return sock.sendMessage(msg.key.remoteJid, { text: 'Bruh this is not a group.' }, { quoted: msg });
    const users = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!users.length) return sock.sendMessage(msg.key.remoteJid, { text: 'Bruh who am I supposed to kick? The air?' }, { quoted: msg });
    
    try {
      await sock.groupParticipantsUpdate(msg.key.remoteJid, users, "remove");
    } catch (e) {
      sock.sendMessage(msg.key.remoteJid, { text: 'Wow that magic even Google cannot do. I need admin rights.' }, { quoted: msg });
    }
  }
};
