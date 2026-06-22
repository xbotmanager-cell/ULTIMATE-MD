import { get } from '../../lib/db.js';

global.scrambleGames = global.scrambleGames || {};

const words = ['javascript', 'python', 'hacker', 'programming', 'network', 'database', 'developer', 'software', 'hardware', 'keyboard'];

export default {
  name: 'scramble',
  alias: ['wordscramble'],
  desc: 'Word Scramble Game',
  category: 'games',
  react: '🔠',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.scrambleGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `scramble end` to stop.' });

        const word = words[Math.floor(Math.random() * words.length)];
        const scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');

        global.scrambleGames[chatId] = { word, startedBy: sender };

        const out = `🔠 *WORD SCRAMBLE* 🔠\n\nUnscramble this word:\n*--------------------*\n* ${scrambled.toUpperCase()} *\n*--------------------*\n\nReply or type \`scramble <guess>\` to answer.\nType \`scramble end\` to stop.`;
        return sock.sendMessage(chatId, { text: out }, { quoted: msg });
      }

      if (cmd === 'end') {
        delete global.scrambleGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.scrambleGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `scramble start` to play.' });

      if (cmd === game.word) {
        delete global.scrambleGames[chatId];
        return sock.sendMessage(chatId, { text: `🎉 Correct! @${sender.split('@')[0]} guessed it right!\nThe word was *${game.word.toUpperCase()}*`, mentions: [sender] }, { quoted: msg });
      } else {
        return sock.sendMessage(chatId, { text: '❌ Wrong! Try again.' }, { quoted: msg });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};