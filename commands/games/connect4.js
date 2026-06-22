import { get } from '../../lib/db.js';

global.c4Games = global.c4Games || {};

const ROWS = 6;
const COLS = 7;

function checkWin(board, player) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;
      if (c + 3 < COLS && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) return true;
      if (r + 3 < ROWS && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) return true;
      if (c + 3 < COLS && r + 3 < ROWS && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) return true;
      if (c - 3 >= 0 && r + 3 < ROWS && board[r+1][c-1] === player && board[r+2][c-2] === player && board[r+3][c-3] === player) return true;
    }
  }
  return false;
}

function formatBoard(board) {
  let str = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      str += board[r][c] === 'R' ? '🔴' : board[r][c] === 'Y' ? '🟡' : '⚪';
    }
    str += '\n';
  }
  str += '1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣';
  return str;
}

function botMove(board) {
  const available = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === '') available.push(c);
  }
  if (available.length === 0) return -1;
  return available[Math.floor(Math.random() * available.length)];
}

export default {
  name: 'connect4',
  alias: ['c4'],
  desc: 'Play Connect 4',
  category: 'games',
  react: '🔴',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.c4Games[chatId]) return sock.sendMessage(chatId, { text: 'Game running! Type `c4 end` to stop.' }, { quoted: msg });

        let p2 = 'bot'; let isBot = true;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          p2 = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
          p2 = msg.message.extendedTextMessage.contextInfo.participant;
          isBot = false;
        }
        if (p2 === sender) return sock.sendMessage(chatId, { text: 'You can\'t play against yourself!' }, { quoted: msg });

        const board = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
        global.c4Games[chatId] = { p1: sender, p2, turn: sender, board, isBot };

        const out = `🔴 *CONNECT 4* 🟡\n\n🎯 *Turn:* @${sender.split('@')[0]}\n\n${formatBoard(board)}\n\n*How to play:*\nUse \`c4 1-7\` to drop your piece!\nP1 is 🔴, P2 is 🟡.\nType \`c4 end\` to end.`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, p2 === 'bot' ? '' : p2] }, { quoted: msg });
      }

      if (cmd === 'end') {
        if (!global.c4Games[chatId]) return sock.sendMessage(chatId, { text: 'No game running!' }, { quoted: msg });
        delete global.c4Games[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' }, { quoted: msg });
      }

      const move = parseInt(cmd);
      const game = global.c4Games[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! `c4 start` to play.' }, { quoted: msg });

      if (game.turn !== sender) return sock.sendMessage(chatId, { text: `Not your turn! Waiting for @${game.turn.split('@')[0]}`, mentions: [game.turn] }, { quoted: msg });

      if (isNaN(move) || move < 1 || move > COLS) return sock.sendMessage(chatId, { text: 'Pick a column 1-7!' }, { quoted: msg });

      const col = move - 1;
      let placedR = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (game.board[r][col] === '') {
          game.board[r][col] = game.turn === game.p1 ? 'R' : 'Y';
          placedR = r;
          break;
        }
      }
      if (placedR === -1) return sock.sendMessage(chatId, { text: 'Column full!' }, { quoted: msg });

      if (checkWin(game.board, game.turn === game.p1 ? 'R' : 'Y')) {
        const res = `🔴 *CONNECT 4* 🟡\n\n${formatBoard(game.board)}\n\n🎉 @${game.turn.split('@')[0]} WON! 🎉`;
        delete global.c4Games[chatId];
        return sock.sendMessage(chatId, { text: res, mentions: [game.turn] }, { quoted: msg });
      }

      game.turn = game.turn === game.p1 ? game.p2 : game.p1;

      if (game.isBot && game.turn === 'bot') {
        const bcol = botMove(game.board);
        if (bcol !== -1) {
          for (let r = ROWS - 1; r >= 0; r--) {
            if (game.board[r][bcol] === '') {
              game.board[r][bcol] = 'Y';
              break;
            }
          }
          if (checkWin(game.board, 'Y')) {
            const res = `🔴 *CONNECT 4* 🟡\n\n${formatBoard(game.board)}\n\n🤖 Bot WON! 💥`;
            delete global.c4Games[chatId];
            return sock.sendMessage(chatId, { text: res }, { quoted: msg });
          }
          game.turn = game.p1;
        }
      }

      if (game.board[0].every(c => c !== '')) {
         delete global.c4Games[chatId];
         return sock.sendMessage(chatId, { text: `🔴 *CONNECT 4* 🟡\n\n${formatBoard(game.board)}\n\nIt's a tie! 🤝` }, { quoted: msg });
      }

      const out = `🔴 *CONNECT 4* 🟡\n\n🎯 *Turn:* @${game.turn.split('@')[0]}\n\n${formatBoard(game.board)}\n\n*How to play:*\nUse \`c4 1-7\` to drop piece!`;
      return sock.sendMessage(chatId, { text: out, mentions: [game.turn === 'bot' ? '' : game.turn] }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Game crashed! 🤡' }, { quoted: msg });
    }
  }
};