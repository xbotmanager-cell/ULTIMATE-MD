import { get } from '../../lib/db.js';

global.hlGames = global.hlGames || {};

export default {
  name: 'higherlower',
  alias: ['hl'],
  desc: 'Higher or Lower Game',
  category: 'games',
  react: '📈',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.hlGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `hl end` to stop.' });

        const num = Math.floor(Math.random() * 100) + 1;
        global.hlGames[chatId] = { num, player: sender, streak: 0 };

        const out = `📈 *HIGHER OR LOWER* 📉\n\n@${sender.split('@')[0]}, your starting number is *${num}*!\nIs the next number going to be \`hl higher\` or \`hl lower\`?\n\nType \`hl end\` to stop.`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      }

      if (cmd === 'end') {
        delete global.hlGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.hlGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `hl start` to play.' });

      if (game.player !== sender) return sock.sendMessage(chatId, { text: 'You are not the player!' });

      if (cmd === 'higher' || cmd === 'h' || cmd === 'lower' || cmd === 'l') {
        const nextNum = Math.floor(Math.random() * 100) + 1;
        const higher = nextNum >= game.num;
        
        const isHigherGuess = cmd.startsWith('h');
        
        let out = `The next number is *${nextNum}*!\n\n`;

        if ((higher && isHigherGuess) || (!higher && !isHigherGuess)) {
           game.streak++;
           game.num = nextNum;
           out += `✅ Correct! Your streak is *${game.streak}*!\nNext: \`hl higher\` or \`hl lower\`?`;
           return sock.sendMessage(chatId, { text: out });
        } else {
           out += `❌ Wrong! Game over! Your final streak was *${game.streak}*.\n\nPlay again using \`hl start\`.`;
           delete global.hlGames[chatId];
           return sock.sendMessage(chatId, { text: out });
        }
      }
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};