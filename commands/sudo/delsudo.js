import { createBox, formatLine } from '../../system/box.js';
import { delSudo, isSudo, listSudo } from '../../lib/sudo.js';

export default {
  name: 'delsudo',
  alias: ['dsudo'],
  desc: 'ʀᴇᴍᴏᴠᴇ sᴜᴅᴏ ᴜsᴇʀ',
  category: 'sudo',
  react: '➖',
  execute: async (sock, msg, args) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!msg.key.fromMe && !isSudo(sender)) return; 
    
    let target = null;
    if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = msg.message.extendedTextMessage.contextInfo.participant;
    } else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
      target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0] && args[0].startsWith('+')) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else if (args[0] && args[0].includes('@')) {
      target = args[0].replace('@', '') + '@s.whatsapp.net';
    }
    
    if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'Reply, tag or use +number syntax.' }, { quoted: msg });
    
    await delSudo(target);
    const count = listSudo().sudos.length;
    const bodyLines = [
      formatLine('ᴜsᴇʀ', `@${target.split('@')[0]}`),
      formatLine('sᴛᴀᴛᴜs', 'ʀᴇᴍᴏᴠᴇᴅ'),
      formatLine('ᴄᴏᴜɴᴛ', `${count}`)
    ];
    return sock.sendMessage(msg.key.remoteJid, { text: createBox('sᴜᴅᴏ ᴍᴀɴᴀɢᴇʀ', bodyLines), mentions: [target] }, { quoted: msg });
  }
};
