import { get } from '../../lib/db.js';

global.rrGames = global.rrGames || {};

export default {
  name: 'russianroulette',
  alias: ['rr'],
  desc: 'Russian Roulette Battle',
  category: 'games',
  react: '🔫',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.rrGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! `rr end` to stop.' });

        let p2 = 'bot'; let isBot = true;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          p2 = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            p2 = msg.message.extendedTextMessage.contextInfo.participant;
            isBot = false;
        }
        if (p2 === sender) return sock.sendMessage(chatId, { text: 'You can\'t play yourself!' });

        const bulletIndex = Math.floor(Math.random() * 6);
        global.rrGames[chatId] = { p1: sender, p2, isBot, turn: sender, position: 0, bulletIndex };

        const out = `🔫 *RUSSIAN ROULETTE* 🔫\n\n@${sender.split('@')[0]} VS ${isBot ? '🤖 Bot' : `@${p2.split('@')[0]}`}\n\nUse \`rr pull\` to pull the trigger.\nFirst turn: @${sender.split('@')[0]}`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, isBot ? '' : p2] });
      }

      if (cmd === 'end') {
        delete global.rrGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.rrGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `rr start` to play.' });

      if (cmd === 'pull') {
        if (game.turn !== sender) return sock.sendMessage(chatId, { text: `Wait! It's @${game.turn.split('@')[0]}'s turn.`, mentions: [game.turn] });

        let out = `🔫 @${sender.split('@')[0]} points the gun and pulls the trigger...\n\n`;

        if (game.position === game.bulletIndex) {
            out += `💥 *BANG!*\n\n@${sender.split('@')[0]} died! 🎉 @${(game.turn === game.p1 ? game.p2 : game.p1).split('@')[0]} WINS!`;
            delete global.rrGames[chatId];
            return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2] });
        } else {
            out += `*Click.* Only empty chamber.\n\n`;
            game.position++;
            game.turn = game.turn === game.p1 ? game.p2 : game.p1;
            
            if (game.isBot) {
               out += `Now it's 🤖 Bot's turn! Pulling trigger...\n`;
               if (game.position === game.bulletIndex) {
                   out += `💥 *BANG!*\n\nBot died! 🎉 @${game.p1.split('@')[0]} WINS!`;
                   delete global.rrGames[chatId];
                   return sock.sendMessage(chatId, { text: out, mentions: [game.p1] });
               } else {
                   out += `*Click.* Bot survives.\n\nNow it's your turn @${game.p1.split('@')[0]}! Use \`rr pull\``;
                   game.position++;
                   game.turn = game.p1;
                   return sock.sendMessage(chatId, { text: out, mentions: [game.p1] });
               }
            } else {
               out += `Now it's @${game.turn.split('@')[0]}'s turn! Use \`rr pull\``;
               return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2] });
            }
        }
      }
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};