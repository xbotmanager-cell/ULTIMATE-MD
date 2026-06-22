import { get } from '../../lib/db.js';

global.hangmanGames = global.hangmanGames || {};

const words = ['javascript', 'typescript', 'developer', 'keyboard', 'monitor', 'internet', 'database', 'server', 'firewall', 'browser'];

export default {
  name: 'hangman',
  alias: ['hm'],
  desc: 'Play Hangman',
  category: 'games',
  react: '🕴️',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.hangmanGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `hangman end` to stop.' });

        const word = words[Math.floor(Math.random() * words.length)];
        global.hangmanGames[chatId] = { word, guesses: [], mistakes: 0, maxMistakes: 6 };

        const hidden = word.split('').map(c => '_').join(' ');
        const out = `🕴️ *HANGMAN* 🕴️\n\nWord: ${hidden}\nMistakes: 0/6\n\nUse \`hangman <letter>\` to guess.\nType \`hangman end\` to stop.`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.hangmanGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.hangmanGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `hangman start` to play.' });

      if (cmd.length !== 1 || !/[a-z]/.test(cmd)) return sock.sendMessage(chatId, { text: 'Send a single letter!' });

      if (game.guesses.includes(cmd)) return sock.sendMessage(chatId, { text: 'Already guessed!' });

      game.guesses.push(cmd);
      if (!game.word.includes(cmd)) game.mistakes++;

      const hidden = game.word.split('').map(c => game.guesses.includes(c) ? c : '_').join(' ');
      
      if (!hidden.includes('_')) {
         const out = `🕴️ *HANGMAN* 🕴️\n\nWord: *${game.word.toUpperCase()}*\n\n🎉 @${sender.split('@')[0]} solved it!`;
         delete global.hangmanGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      } else if (game.mistakes >= game.maxMistakes) {
         const out = `🕴️ *HANGMAN* 🕴️\n\n❌ Game Over! The word was *${game.word.toUpperCase()}*.`;
         delete global.hangmanGames[chatId];
         return sock.sendMessage(chatId, { text: out });
      } else {
         const out = `🕴️ *HANGMAN* 🕴️\n\nWord: ${hidden}\nMistakes: ${game.mistakes}/6\nGuessed: ${game.guesses.join(', ')}`;
         return sock.sendMessage(chatId, { text: out });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};