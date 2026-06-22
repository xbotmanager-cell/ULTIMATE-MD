import { get } from '../../lib/db.js';

global.wordleGames = global.wordleGames || {};

const words = ['apple', 'grape', 'mango', 'peach', 'berry', 'plant', 'crane', 'train', 'brain', 'smart', 'cloud', 'phone', 'table', 'chair', 'house'];

export default {
  name: 'wordle',
  alias: ['wdl'],
  desc: 'Play Wordle',
  category: 'games',
  react: '🔠',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.wordleGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `wordle end` to stop.' });

        const word = words[Math.floor(Math.random() * words.length)];
        global.wordleGames[chatId] = { word, attempts: 6, guesses: [], player: sender };

        const out = `🔠 *WORDLE* 🔠\n\n@${sender.split('@')[0]}, guess the 5-letter word!\nYou have 6 attempts.\n\nUse \`wordle <5-letter-word>\` to guess.\nType \`wordle end\` to stop.`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      }

      if (cmd === 'end') {
        delete global.wordleGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.wordleGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `wordle start` to play.' });

      if (game.player !== sender) return sock.sendMessage(chatId, { text: 'You are not the player!' });

      if (cmd.length !== 5) return sock.sendMessage(chatId, { text: 'Must be a 5-letter word!' });

      let result = '';
      for (let i = 0; i < 5; i++) {
         if (cmd[i] === game.word[i]) result += '🟩';
         else if (game.word.includes(cmd[i])) result += '🟨';
         else result += '⬛';
      }

      game.guesses.push(`${cmd.toUpperCase()} ${result}`);
      game.attempts--;

      if (cmd === game.word) {
         const out = `🔠 *WORDLE* 🔠\n\n${game.guesses.join('\n')}\n\n🎉 You guessed it!`;
         delete global.wordleGames[chatId];
         return sock.sendMessage(chatId, { text: out });
      } else if (game.attempts === 0) {
         const out = `🔠 *WORDLE* 🔠\n\n${game.guesses.join('\n')}\n\n❌ Game Over! The word was *${game.word.toUpperCase()}*.`;
         delete global.wordleGames[chatId];
         return sock.sendMessage(chatId, { text: out });
      } else {
         const out = `🔠 *WORDLE* 🔠\n\n${game.guesses.join('\n')}\n\nAttempts left: ${game.attempts}`;
         return sock.sendMessage(chatId, { text: out });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};