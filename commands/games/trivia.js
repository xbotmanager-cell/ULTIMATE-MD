import { get } from '../../lib/db.js';

global.triviaGames = global.triviaGames || {};

const questions = [
  { q: "What is the capital of France?", a: "paris" },
  { q: "What is the largest planet?", a: "jupiter" },
  { q: "How many continents are there?", a: "7" },
  { q: "Who wrote Romeo and Juliet?", a: "shakespeare" },
  { q: "What is the chemical symbol for Gold?", a: "au" },
  { q: "What is H2O commonly known as?", a: "water" },
  { q: "In what year did the Titanic sink?", a: "1912" },
  { q: "What is 15 * 6?", a: "90" }
];

export default {
  name: 'trivia',
  alias: ['quiz'],
  desc: 'Play Trivia Quiz',
  category: 'games',
  react: '🧠',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args.join(' ').toLowerCase();

      if (cmd === 'start') {
        if (global.triviaGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `trivia end` to stop.' });

        const q = questions[Math.floor(Math.random() * questions.length)];
        global.triviaGames[chatId] = { q: q.q, a: q.a, startedBy: sender };

        const out = `🧠 *TRIVIA QUIZ* 🧠\n\n❓: *${q.q}*\n\nUse \`trivia <answer>\` to play.\nType \`trivia end\` to stop.`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.triviaGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.triviaGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `trivia start` to play.' });

      if (cmd === game.a) {
         const out = `🎉 @${sender.split('@')[0]} guessed it right!\nAnswer: *${game.a.toUpperCase()}*`;
         delete global.triviaGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      } else {
         return sock.sendMessage(chatId, { text: '❌ Wrong! Try again.' });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};
