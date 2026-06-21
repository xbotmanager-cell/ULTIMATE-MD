export default {
  name: 'hidetag',
  alias: ['ht'],
  desc: 'ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴇʀs ʜɪᴅᴅᴇɴ',
  category: 'group',
  react: '🔊',
  execute: async (sock, msg, args) => {
    if (!msg.key.remoteJid.endsWith('@g.us')) return sock.sendMessage(msg.key.remoteJid, { text: 'Bruh this is a private chat, what are you trying to hide?' }, { quoted: msg });
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    const participants = groupMetadata.participants.map(p => p.id);
    await sock.sendMessage(msg.key.remoteJid, { text: args.join(' ') || 'Attention!', mentions: participants });
  }
};
