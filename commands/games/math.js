import { get } from '../../lib/db.js';

global.mathGames = global.mathGames || {};

export default {
  name: 'math',
  alias: ['mathq'],
  desc: 'Math Quiz',
  category: 'games',
  react: '➕',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.mathGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `math end` to stop.' });

        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const n1 = Math.floor(Math.random() * 50) + 1;
        const n2 = Math.floor(Math.random() * 20) + 1;
        const q = `${n1} ${op} ${n2}`;
        const ans = eval(q);

        global.mathGames[chatId] = { ans };

        const out = `➕ *MATH QUIZ* ➖\n\nWhat is: *${q}* = ?\n\nUse \`math <answer>\` to answer.\nType \`math end\` to stop.`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.mathGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.mathGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `math start` to play.' });

      const ans = parseInt(cmd);
      if (isNaN(ans)) return sock.sendMessage(chatId, { text: 'Send a number!' });

      if (ans === game.ans) {
         const out = `🎉 @${sender.split('@')[0]} is correct!\nThe answer is *${game.ans}*!`;
         delete global.mathGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      } else {
         return sock.sendMessage(chatId, { text: '❌ wrong! Try again.' });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};