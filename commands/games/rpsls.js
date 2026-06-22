import { get } from '../../lib/db.js';

global.rpslsGames = global.rpslsGames || {};

const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
const emojis = { rock: '🪨', paper: '📄', scissors: '✂️', lizard: '🦎', spock: '🖖' };
const mapping = {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['spock', 'paper'],
    spock: ['scissors', 'rock']
};

function getWinner(c1, c2) {
  if (c1 === c2) return 'tie';
  if (mapping[c1].includes(c2)) return 'p1';
  return 'p2';
}

export default {
  name: 'rpsls',
  alias: ['rockpaperscissorslizardspock'],
  desc: 'Play RPSLS',
  category: 'games',
  react: '🖖',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.rpslsGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `rpsls end` to stop.' }, { quoted: msg });

        let p2 = 'bot'; let isBot = true;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          p2 = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            p2 = msg.message.extendedTextMessage.contextInfo.participant;
            isBot = false;
        }
        if (p2 === sender) return sock.sendMessage(chatId, { text: 'Play with someone else!' }, { quoted: msg });

        global.rpslsGames[chatId] = { p1: sender, p2, isBot, p1Choice: null, p2Choice: isBot ? choices[Math.floor(Math.random()*5)] : null };

        const out = `🖖 *RPSLS* 🦎\n\n@${sender.split('@')[0]} VS ${isBot ? '🤖 Bot' : `@${p2.split('@')[0]}`}\n\nPlayers, PM the bot directly or use \`rpsls rock/paper/scissors/lizard/spock\` here.\n*Hint:* Sending in group is public!`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, isBot ? '' : p2] }, { quoted: msg });
      }

      if (cmd === 'end') {
        delete global.rpslsGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' }, { quoted: msg });
      }

      const game = global.rpslsGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `rpsls start` to play.' }, { quoted: msg });

      if (!choices.includes(cmd)) return sock.sendMessage(chatId, { text: 'Choose rock, paper, scissors, lizard, or spock!' }, { quoted: msg });

      if (sender === game.p1) game.p1Choice = cmd;
      else if (sender === game.p2) game.p2Choice = cmd;
      else return sock.sendMessage(chatId, { text: 'You are not in this game!' }, { quoted: msg });

      sock.sendMessage(chatId, { text: `@${sender.split('@')[0]} has locked their choice! 🔒`, mentions: [sender] }, { quoted: msg });

      if (game.p1Choice && game.p2Choice) {
         const winner = getWinner(game.p1Choice, game.p2Choice);
         let out = `🖖 *RPSLS RESULT* 🦎\n\n@${game.p1.split('@')[0]} chose ${emojis[game.p1Choice]}\n`;
         out += game.isBot ? `🤖 Bot chose ${emojis[game.p2Choice]}\n\n` : `@${game.p2.split('@')[0]} chose ${emojis[game.p2Choice]}\n\n`;
         
         if (winner === 'tie') out += 'It\'s a TIE! 🤝';
         else if (winner === 'p1') out += `🎉 @${game.p1.split('@')[0]} WON!`;
         else out += game.isBot ? '🤖 Bot WON! 💥' : `🎉 @${game.p2.split('@')[0]} WON!`;

         delete global.rpslsGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2].filter(x => x && x !== 'bot') });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};