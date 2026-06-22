import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'telegramstalk',
  alias: ['stalktelegram', 'tgstalk'],
  desc: 'Stalk a Telegram profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Telegram username!' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'TELEGRAM'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('sᴛᴀᴛᴜs', 'API restricts direct stalking.'),
            formatLine('ʟɪɴᴋ', `t.me/${username}`)
         ]);
         
         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};