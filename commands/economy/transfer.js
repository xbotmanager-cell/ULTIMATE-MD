import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'transfer',
  desc: 'Economy command for transfer',
  category: 'economy',
  execute: async (sock, msg, args) => {
      try {
         const jid = msg.key.participant || msg.key.remoteJid;
         const botname = get('botname') || 'ULTIMATE-MD';
         
         // simple local balance placeholder system
         let balanceKey = jid + '_balance';
         let balance = get(balanceKey) || 0;

         let result = '';

         if ('transfer' === 'balance') {
             result = \`You currently have ${balance} 💰 coins\`;
         } else if ('transfer' === 'work') {
             const earned = Math.floor(Math.random() * 500) + 100;
             balance += earned;
             await set(balanceKey, balance);
             result = \`You worked hard and earned ${earned} 💰! New balance: ${balance}\`;
         } else if ('transfer' === 'daily') {
             result = \`You claimed your daily 1000 💰!\`;
             balance += 1000;
             await set(balanceKey, balance);
         } else {
             result = \`TRANSFER function is coming soon!\`;
         }

         const box = createBox('ᴇᴄᴏɴᴏᴍʏ 💸', [
            formatLine('ᴜsᴇʀ', jid.split('@')[0]),
            formatLine('ᴀᴄᴛɪᴏɴ', 'TRANSFER'),
            formatLine('ɪɴғᴏ', result)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in economy.' }, { quoted: msg });
      }
  }
};
