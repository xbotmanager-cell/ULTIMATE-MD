import { get } from '../../lib/db.js';

export default {
  name: 'slots',
  alias: ['slotmachine'],
  desc: 'Play Slot Machine',
  category: 'games',
  react: '🎰',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;

      const items = ['🍒', '🍋', '🍉', '🍇', '🔔', '💎', '7️⃣'];
      const r1 = items[Math.floor(Math.random() * items.length)];
      const r2 = items[Math.floor(Math.random() * items.length)];
      const r3 = items[Math.floor(Math.random() * items.length)];

      let out = `🎰 *SLOT MACHINE* 🎰\n\n[ ${r1} | ${r2} | ${r3} ]\n\n`;

      if (r1 === r2 && r2 === r3) {
         out += `🎉 JACKPOT! @${sender.split('@')[0]} WINS!`;
      } else if (r1 === r2 || r2 === r3 || r1 === r3) {
         out += `✨ Small win! @${sender.split('@')[0]} got 2 matching.`;
      } else {
         out += `❌ You lose. Try again!`;
      }

      await sock.sendMessage(chatId, { text: out, mentions: [sender] });

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};