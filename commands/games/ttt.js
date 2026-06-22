import { get } from '../../lib/db.js';

global.tttGames = global.tttGames || {};

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function checkWinner(board) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes('')) return 'Tie';
  return null;
}

function formatBoard(board) {
  const b = board.map((val, i) => {
    if (val === 'X') return '❌';
    if (val === 'O') return '⭕';
    const nums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    return nums[i];
  });
  return `${b[0]} ┃ ${b[1]} ┃ ${b[2]}\n━━━╋━━━╋━━━\n${b[3]} ┃ ${b[4]} ┃ ${b[5]}\n━━━╋━━━╋━━━\n${b[6]} ┃ ${b[7]} ┃ ${b[8]}`;
}

function botMove(board) {
  const available = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
  if (available.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

export default {
  name: 'ttt',
  alias: ['tictactoe'],
  desc: 'Play Tic-Tac-Toe',
  category: 'games',
  react: '🎮',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.tttGames[chatId]) {
          return sock.sendMessage(chatId, { text: 'A game is already running in this chat! Type `ttt end` to stop it.' }, { quoted: msg });
        }

        let playerO = 'bot';
        let isBot = true;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          playerO = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            playerO = msg.message.extendedTextMessage.contextInfo.participant;
            isBot = false;
        }

        if (playerO === sender) {
           return sock.sendMessage(chatId, { text: 'You can\\'t play against yourself!' }, { quoted: msg });
        }

        global.tttGames[chatId] = {
          playerX: sender,
          playerO: playerO,
          turn: sender,
          board: ['', '', '', '', '', '', '', '', ''],
          isBot: isBot
        };

        const topMsg = `🎮 *TIC-TAC-TOE* 🎮\n\n🎯 *Current Turn:* @${sender.split('@')[0]}\n\n${formatBoard(global.tttGames[chatId].board)}\n\n*How to play:*\nUse \`ttt 1-9\` to place your mark (❌).\nPlayer O uses ⭕.\nType \`ttt end\` to end the game.`;
        
        await sock.sendMessage(chatId, { text: topMsg, mentions: [sender, playerO === 'bot' ? '' : playerO] }, { quoted: msg });
        return;
      }

      if (cmd === 'end') {
        if (global.tttGames[chatId]) {
          delete global.tttGames[chatId];
          return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' }, { quoted: msg });
        } else {
          return sock.sendMessage(chatId, { text: 'No game is currently running!' }, { quoted: msg });
        }
      }

      const move = parseInt(cmd);
      if (!isNaN(move) && move >= 1 && move <= 9) {
        const game = global.tttGames[chatId];
        if (!game) {
          return sock.sendMessage(chatId, { text: 'No game is running! Start one using `ttt start`.' }, { quoted: msg });
        }

        const index = move - 1;

        if (game.turn !== sender) {
          return sock.sendMessage(chatId, { text: `It's not your turn! Waiting for @${game.turn.split('@')[0]}`, mentions: [game.turn] }, { quoted: msg });
        }

        if (game.board[index] !== '') {
          return sock.sendMessage(chatId, { text: 'That spot is already taken! Try another one.' }, { quoted: msg });
        }

        // Apply Player Move
        game.board[index] = game.turn === game.playerX ? 'X' : 'O';

        let winner = checkWinner(game.board);
        if (winner) {
           const resultMsg = `🎮 *TIC-TAC-TOE* 🎮\n\n${formatBoard(game.board)}\n\n🏅 *Result:*\n` + (winner === 'Tie' ? 'It\\'s a tie! 🤝' : `🎉 @${game.turn.split('@')[0]} WON! 🎉`);
           delete global.tttGames[chatId];
           return sock.sendMessage(chatId, { text: resultMsg, mentions: [game.turn, game.playerX, game.playerO].filter(v => v!== 'bot') }, { quoted: msg });
        }

        // Complete Player Turn
        game.turn = game.turn === game.playerX ? game.playerO : game.playerX;
        
        // Bot's Turn
        if (game.isBot && game.turn === 'bot') {
            const bMove = botMove(game.board);
            if (bMove !== -1) {
                game.board[bMove] = 'O';
                winner = checkWinner(game.board);
                if (winner) {
                   const resultMsg = `🎮 *TIC-TAC-TOE* 🎮\n\n${formatBoard(game.board)}\n\n🏅 *Result:*\n` + (winner === 'Tie' ? 'It\\'s a tie! 🤝' : `🤖 Bot WON! Better luck next time! 💥`);
                   delete global.tttGames[chatId];
                   return sock.sendMessage(chatId, { text: resultMsg }, { quoted: msg });
                }
                game.turn = game.playerX;
            }
        }

        const updateMsg = `🎮 *TIC-TAC-TOE* 🎮\n\n🎯 *Current Turn:* @${game.turn.split('@')[0]}\n\n${formatBoard(game.board)}\n\n*How to play:*\nUse \`ttt 1-9\` to place your mark!`;
        return sock.sendMessage(chatId, { text: updateMsg, mentions: [game.turn === 'bot' ? '' : game.turn] }, { quoted: msg });
      }

      return sock.sendMessage(chatId, { text: 'Command not recognized.\nUse `ttt start` to start a match.\nUse `ttt end` to end a match.\nUse `ttt 1-9` to make a move!' }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'I tripped and lost the game for you! 🤡' }, { quoted: msg });
    }
  }
};
