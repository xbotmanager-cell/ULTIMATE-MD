import { get } from '../../lib/db.js';

global.anagramGames = global.anagramGames || {};

const pairs = [
  { w: "listen", a: "silent" },
  { w: "triangle", a: "integral" },
  { w: "earth", a: "heart" },
  { w: "state", a: "taste" },
  { w: "dusty", a: "study" },
  { w: "night", a: "thing" }
];

export default {
  name: 'anagram',
  alias: ['ag'],
  desc: 'Anagram Game',
  category: 'games',
  react: '🔄',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.anagramGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `anagram end` to stop.' });

        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        global.anagramGames[chatId] = { word: pair.w, ans: pair.a, startedBy: sender };

        const out = `🔄 *ANAGRAM* 🔄\n\nFind a valid word with the exact same letters as:\n\n*${pair.w.toUpperCase()}*\n\nUse \`anagram <word>\` to guess.\nType \`anagram end\` to stop.`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.anagramGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.anagramGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `anagram start` to play.' });

      if (cmd === game.ans) {
         const out = `🎉 @${sender.split('@')[0]} got it!\nThe anagram is *${game.ans.toUpperCase()}*`;
         delete global.anagramGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      } else {
         return sock.sendMessage(chatId, { text: '❌ Wrong! Not the anagram I\'m thinking of.' });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};