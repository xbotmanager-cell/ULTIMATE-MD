import { get } from '../../lib/db.js';

global.typingGames = global.typingGames || {};

const phrases = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "Patience is a key element of success.",
  "Never gonna give you up.",
  "May the Force be with you."
];

export default {
  name: 'typing',
  alias: ['typefast'],
  desc: 'Typing Speed Challenge',
  category: 'games',
  react: '⌨️',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.typingGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `typing end` to stop.' });

        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        global.typingGames[chatId] = { phrase, startTime: Date.now(), player: sender };

        const out = `⌨️ *TYPING CHALLENGE* ⌨️\n\nType the exact sentence below as fast as possible:\n\n*${phrase}*\n\nUse \`typing <your text>\`\nType \`typing end\` to stop.`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      }

      if (cmd === 'end') {
        delete global.typingGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.typingGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `typing start` to play.' });

      if (game.player !== sender) return sock.sendMessage(chatId, { text: 'Only the one who started can type!' });

      const attempt = args.join(' ');
      if (attempt === game.phrase) {
         const timeTaken = ((Date.now() - game.startTime) / 1000).toFixed(2);
         const wpm = Math.floor((game.phrase.split(' ').length / timeTaken) * 60);

         const out = `⌨️ *TYPING CHALLENGE* ⌨️\n\n🎉 Flawless!\nTime: *${timeTaken}s*\nSpeed: *${wpm} WPM*`;
         delete global.typingGames[chatId];
         return sock.sendMessage(chatId, { text: out });
      } else {
         return sock.sendMessage(chatId, { text: '❌ Incorrect! Check caps and punctuation.' });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};