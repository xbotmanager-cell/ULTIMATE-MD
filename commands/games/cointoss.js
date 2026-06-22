import { get } from '../../lib/db.js';

export default {
  name: 'cointoss',
  alias: ['coinflip', 'toss', 'flip'],
  desc: 'Toss a coin',
  category: 'games',
  react: '🪙',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      
      const coins = ['Heads 🪙', 'Tails 🪙'];
      const result = coins[Math.floor(Math.random() * coins.length)];

      await sock.sendMessage(chatId, { text: `@${sender.split('@')[0]} flipped a coin...\n\nIt landed on: *${result}*!`, mentions: [sender] });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};