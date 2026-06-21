import { createBox, formatLine } from '../../system/box.js';
import { banSudo, isSudo } from '../../lib/sudo.js';

export default {
  name: 'bansudo',
  alias: ['bsudo'],
  desc: 'ᴛᴇᴍᴘ ʙᴀɴ sᴜᴅᴏ',
  category: 'sudo',
  react: '⛔',
  execute: async (sock, msg, args) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    if (!msg.key.fromMe && !isSudo(sender)) return; 
    
    let target = null;
    let timeArg = '';
    
    if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = msg.message.extendedTextMessage.contextInfo.participant;
      timeArg = args[0];
    } else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
      target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      timeArg = args.find(a => !a.includes('@'));
    } else if (args[0] && args[0].startsWith('+')) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      timeArg = args[1];
    } else if (args[0] && args[0].includes('@')) {
      target = args[0].replace('@', '') + '@s.whatsapp.net';
      timeArg = args[1];
    }
    
    if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'Reply, tag or use +number syntax.' }, { quoted: msg });
    
    let ms = 24 * 60 * 60 * 1000;
    if (timeArg) {
      const val = parseInt(timeArg.slice(0, -1));
      const unit = timeArg.slice(-1).toLowerCase();
      if (!isNaN(val)) {
        if (unit === 'm') ms = val * 60 * 1000;
        else if (unit === 'h') ms = val * 60 * 60 * 1000;
        else if (unit === 'd') ms = val * 24 * 60 * 60 * 1000;
        else if (unit === 'w') ms = val * 7 * 24 * 60 * 60 * 1000;
      }
    }
    
    await banSudo(target, 'Banned via command', ms);
    
    const bodyLines = [
      formatLine('ᴜsᴇʀ', `@${target.split('@')[0]}`),
      formatLine('sᴛᴀᴛᴜs', 'ʙᴀɴɴᴇᴅ'),
      formatLine('ᴅᴜʀᴀᴛɪᴏɴ', timeArg || '1d')
    ];
    return sock.sendMessage(msg.key.remoteJid, { text: createBox('sᴜᴅᴏ ᴍᴀɴᴀɢᴇʀ', bodyLines), mentions: [target] }, { quoted: msg });
  }
};
