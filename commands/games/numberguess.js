import { get } from '../../lib/db.js';

global.guessGames = global.guessGames || {};

export default {
  name: 'guess',
  alias: ['guessnum'],
  desc: 'Guess the Number',
  category: 'games',
  react: '🔢',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.guessGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `guess end` to stop.' });

        const num = Math.floor(Math.random() * 50) + 1;
        global.guessGames[chatId] = { num, attempts: 0 };

        const out = `🔢 *GUESS THE NUMBER* 🔢\n\nI'm thinking of a number between 1 and 50.\nUse \`guess <number>\` to try!\n\nType \`guess end\` to stop.`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.guessGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.guessGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `guess start` to play.' });

      const guess = parseInt(cmd);
      if (isNaN(guess)) return sock.sendMessage(chatId, { text: 'Send a number!' });

      game.attempts++;

      if (guess < game.num) {
         return sock.sendMessage(chatId, { text: '📈 Too Low! Try again.' });
      } else if (guess > game.num) {
         return sock.sendMessage(chatId, { text: '📉 Too High! Try again.' });
      } else {
         const out = `🎉 @${sender.split('@')[0]} guessed it right!\nThe number was *${game.num}*!\nAttempts: ${game.attempts}`;
         delete global.guessGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};