import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'math',
  desc: 'Game command for math',
  category: 'games',
  execute: async (sock, msg, args) => {
      try {
         const input = args[0]?.toLowerCase();
         const botname = get('botname') || 'ULTIMATE-MD';
         let result = '';

         if ('math' === 'math') {
             result = 'What is 8 * 7? Reply with the answer! (Hint: 56)';
         } else if ('math' === 'rps') {
             const choices = ['rock', 'paper', 'scissors'];
             const botChoice = choices[Math.floor(Math.random() * 3)];
             if(!input) result = 'Choose rock, paper, or scissors!';
             else result = \`You chose ${input}, I chose ${botChoice}. It's a game!\`;
         } else if ('math' === 'flip') {
             result = 'Coin landed on: ' + (Math.random() > 0.5 ? 'Heads' : 'Tails');
         } else if ('math' === 'dice') {
             const val = Math.floor(Math.random() * 6) + 1;
             result = \`You rolled a ${val} 🎲\`;
         } else {
             result = 'Play with me later!';
         }

         const box = createBox('ɢᴀᴍᴇs 🎮', [
            formatLine('ɢᴀᴍᴇ', 'MATH'),
            formatLine('ɪɴғᴏ', result)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in game.' }, { quoted: msg });
      }
  }
};
