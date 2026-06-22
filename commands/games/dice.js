import { get } from '../../lib/db.js';

global.diceGames = global.diceGames || {};

export default {
  name: 'dice',
  alias: ['roll'],
  desc: 'Roll Dice Battle',
  category: 'games',
  react: '🎲',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.diceGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `dice end` to stop.' });

        let p2 = 'bot'; let isBot = true;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          p2 = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
          p2 = msg.message.extendedTextMessage.contextInfo.participant;
          isBot = false;
        }
        if (p2 === sender) return sock.sendMessage(chatId, { text: 'You can\'t play yourself!' });

        global.diceGames[chatId] = { p1: sender, p2, isBot, turn: sender };

        const out = `🎲 *DICE BATTLE* 🎲\n\n@${sender.split('@')[0]} VS ${isBot ? '🤖 Bot' : `@${p2.split('@')[0]}`}\n\nUse \`dice roll\` to roll.\nFirst turn: @${sender.split('@')[0]}`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, isBot ? '' : p2] });
      }

      if (cmd === 'end') {
        delete global.diceGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.diceGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `dice start` to play.' });

      if (cmd === 'roll') {
        if (game.turn !== sender) return sock.sendMessage(chatId, { text: `Wait! It's @${game.turn.split('@')[0]}'s turn.`, mentions: [game.turn] });

        const roll1 = Math.floor(Math.random() * 6) + 1;
        
        let out = `🎲 @${sender.split('@')[0]} rolled a *${roll1}*!\n\n`;

        if (game.isBot) {
           const roll2 = Math.floor(Math.random() * 6) + 1;
           out += `🎲 🤖 Bot rolled a *${roll2}*!\n\n`;
           
           if (roll1 > roll2) out += `🎉 @${sender.split('@')[0]} WINS!`;
           else if (roll2 > roll1) out += `🤖 Bot WINS!`;
           else out += 'It\'s a TIE! 🤝';
           
           delete global.diceGames[chatId];
           return sock.sendMessage(chatId, { text: out, mentions: [sender] });
        } else {
           if (!game.p1Roll) {
               game.p1Roll = roll1;
               game.turn = game.p2;
               out += `Now it's @${game.p2.split('@')[0]}'s turn!`;
               return sock.sendMessage(chatId, { text: out, mentions: [sender, game.p2] });
           } else {
               const roll2 = roll1;
               const roll1Val = game.p1Roll;
               out = `🎲 @${game.p1.split('@')[0]} rolled: *${roll1Val}*\n`;
               out += `🎲 @${game.p2.split('@')[0]} rolled: *${roll2}*\n\n`;
               
               if (roll1Val > roll2) out += `🎉 @${game.p1.split('@')[0]} WINS!`;
               else if (roll2 > roll1Val) out += `🎉 @${game.p2.split('@')[0]} WINS!`;
               else out += 'It\'s a TIE! 🤝';

               delete global.diceGames[chatId];
               return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2] });
           }
        }
      }
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};