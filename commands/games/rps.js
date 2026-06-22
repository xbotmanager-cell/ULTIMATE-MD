import { get } from '../../lib/db.js';

global.rpsGames = global.rpsGames || {};

const choices = ['rock', 'paper', 'scissors'];
const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

function getWinner(c1, c2) {
  if (c1 === c2) return 'tie';
  if ((c1 === 'rock' && c2 === 'scissors') || (c1 === 'paper' && c2 === 'rock') || (c1 === 'scissors' && c2 === 'paper')) return 'p1';
  return 'p2';
}

export default {
  name: 'rps',
  alias: ['rockpaperscissors'],
  desc: 'Play Rock Paper Scissors',
  category: 'games',
  react: '✂️',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.rpsGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `rps end` to stop.' }, { quoted: msg });

        let p2 = 'bot'; let isBot = true;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          p2 = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
          p2 = msg.message.extendedTextMessage.contextInfo.participant;
          isBot = false;
        }
        if (p2 === sender) return sock.sendMessage(chatId, { text: 'Play with someone else!' }, { quoted: msg });

        global.rpsGames[chatId] = { p1: sender, p2, isBot, p1Choice: null, p2Choice: isBot ? choices[Math.floor(Math.random()*3)] : null };

        const out = `✂️ *ROCK PAPER SCISSORS* 🪨\n\n@${sender.split('@')[0]} VS ${isBot ? '🤖 Bot' : `@${p2.split('@')[0]}`}\n\nPlayers, PM the bot directly or use \`rps rock/paper/scissors\` here.\n*Hint:* Sending in group is public!`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, isBot ? '' : p2] }, { quoted: msg });
      }

      if (cmd === 'end') {
        delete global.rpsGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' }, { quoted: msg });
      }

      const game = global.rpsGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `rps start` to play.' }, { quoted: msg });

      if (!choices.includes(cmd)) return sock.sendMessage(chatId, { text: 'Choose rock, paper, or scissors!' }, { quoted: msg });

      if (sender === game.p1) game.p1Choice = cmd;
      else if (sender === game.p2) game.p2Choice = cmd;
      else return sock.sendMessage(chatId, { text: 'You are not in this game!' }, { quoted: msg });

      sock.sendMessage(chatId, { text: `@${sender.split('@')[0]} has locked their choice! 🔒`, mentions: [sender] }, { quoted: msg });

      if (game.p1Choice && game.p2Choice) {
         const winner = getWinner(game.p1Choice, game.p2Choice);
         let out = `✂️ *RPS RESULT* 🪨\n\n@${game.p1.split('@')[0]} chose ${emojis[game.p1Choice]}\n`;
         out += game.isBot ? `🤖 Bot chose ${emojis[game.p2Choice]}\n\n` : `@${game.p2.split('@')[0]} chose ${emojis[game.p2Choice]}\n\n`;
         
         if (winner === 'tie') out += 'It\'s a TIE! 🤝';
         else if (winner === 'p1') out += `🎉 @${game.p1.split('@')[0]} WON!`;
         else out += game.isBot ? '🤖 Bot WON! 💥' : `🎉 @${game.p2.split('@')[0]} WON!`;

         delete global.rpsGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2].filter(x => x && x !== 'bot') });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' }, { quoted: msg });
    }
  }
};