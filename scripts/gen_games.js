import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const gamesDir = path.join(baseDir, 'commands', 'games');
if (!fs.existsSync(gamesDir)) fs.mkdirSync(gamesDir, { recursive: true });

const games = {};

games['connect4.js'] = `import { get } from '../../lib/db.js';

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
    str += '\\n';
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
        if (global.c4Games[chatId]) return sock.sendMessage(chatId, { text: 'Game running! Type \`c4 end\` to stop.' }, { quoted: msg });

        let p2 = 'bot'; let isBot = true;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          p2 = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
          p2 = msg.message.extendedTextMessage.contextInfo.participant;
          isBot = false;
        }
        if (p2 === sender) return sock.sendMessage(chatId, { text: 'You can\\'t play against yourself!' }, { quoted: msg });

        const board = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
        global.c4Games[chatId] = { p1: sender, p2, turn: sender, board, isBot };

        const out = \`🔴 *CONNECT 4* 🟡\\n\\n🎯 *Turn:* @\${sender.split('@')[0]}\\n\\n\${formatBoard(board)}\\n\\n*How to play:*\\nUse \\\`c4 1-7\\\` to drop your piece!\\nP1 is 🔴, P2 is 🟡.\\nType \\\`c4 end\\\` to end.\`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, p2 === 'bot' ? '' : p2] }, { quoted: msg });
      }

      if (cmd === 'end') {
        if (!global.c4Games[chatId]) return sock.sendMessage(chatId, { text: 'No game running!' }, { quoted: msg });
        delete global.c4Games[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' }, { quoted: msg });
      }

      const move = parseInt(cmd);
      const game = global.c4Games[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`c4 start\` to play.' }, { quoted: msg });

      if (game.turn !== sender) return sock.sendMessage(chatId, { text: \`Not your turn! Waiting for @\${game.turn.split('@')[0]}\`, mentions: [game.turn] }, { quoted: msg });

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
        const res = \`🔴 *CONNECT 4* 🟡\\n\\n\${formatBoard(game.board)}\\n\\n🎉 @\${game.turn.split('@')[0]} WON! 🎉\`;
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
            const res = \`🔴 *CONNECT 4* 🟡\\n\\n\${formatBoard(game.board)}\\n\\n🤖 Bot WON! 💥\`;
            delete global.c4Games[chatId];
            return sock.sendMessage(chatId, { text: res }, { quoted: msg });
          }
          game.turn = game.p1;
        }
      }

      if (game.board[0].every(c => c !== '')) {
         delete global.c4Games[chatId];
         return sock.sendMessage(chatId, { text: \`🔴 *CONNECT 4* 🟡\\n\\n\${formatBoard(game.board)}\\n\\nIt's a tie! 🤝\` }, { quoted: msg });
      }

      const out = \`🔴 *CONNECT 4* 🟡\\n\\n🎯 *Turn:* @\${game.turn.split('@')[0]}\\n\\n\${formatBoard(game.board)}\\n\\n*How to play:*\\nUse \\\`c4 1-7\\\` to drop piece!\`;
      return sock.sendMessage(chatId, { text: out, mentions: [game.turn === 'bot' ? '' : game.turn] }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Game crashed! 🤡' }, { quoted: msg });
    }
  }
};`;

games['rps.js'] = `import { get } from '../../lib/db.js';

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
        if (global.rpsGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`rps end\` to stop.' }, { quoted: msg });

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

        const out = \`✂️ *ROCK PAPER SCISSORS* 🪨\\n\\n@\${sender.split('@')[0]} VS \${isBot ? '🤖 Bot' : \`@\${p2.split('@')[0]}\`}\\n\\nPlayers, PM the bot directly or use \\\`rps rock/paper/scissors\\\` here.\\n*Hint:* Sending in group is public!\`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, isBot ? '' : p2] }, { quoted: msg });
      }

      if (cmd === 'end') {
        delete global.rpsGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' }, { quoted: msg });
      }

      const game = global.rpsGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`rps start\` to play.' }, { quoted: msg });

      if (!choices.includes(cmd)) return sock.sendMessage(chatId, { text: 'Choose rock, paper, or scissors!' }, { quoted: msg });

      if (sender === game.p1) game.p1Choice = cmd;
      else if (sender === game.p2) game.p2Choice = cmd;
      else return sock.sendMessage(chatId, { text: 'You are not in this game!' }, { quoted: msg });

      sock.sendMessage(chatId, { text: \`@\${sender.split('@')[0]} has locked their choice! 🔒\`, mentions: [sender] }, { quoted: msg });

      if (game.p1Choice && game.p2Choice) {
         const winner = getWinner(game.p1Choice, game.p2Choice);
         let out = \`✂️ *RPS RESULT* 🪨\\n\\n@\${game.p1.split('@')[0]} chose \${emojis[game.p1Choice]}\\n\`;
         out += game.isBot ? \`🤖 Bot chose \${emojis[game.p2Choice]}\\n\\n\` : \`@\${game.p2.split('@')[0]} chose \${emojis[game.p2Choice]}\\n\\n\`;
         
         if (winner === 'tie') out += 'It\\'s a TIE! 🤝';
         else if (winner === 'p1') out += \`🎉 @\${game.p1.split('@')[0]} WON!\`;
         else out += game.isBot ? '🤖 Bot WON! 💥' : \`🎉 @\${game.p2.split('@')[0]} WON!\`;

         delete global.rpsGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2].filter(x => x && x !== 'bot') });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' }, { quoted: msg });
    }
  }
};`;

games['scramble.js'] = `import { get } from '../../lib/db.js';

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
        if (global.scrambleGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`scramble end\` to stop.' });

        const word = words[Math.floor(Math.random() * words.length)];
        const scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');

        global.scrambleGames[chatId] = { word, startedBy: sender };

        const out = \`🔠 *WORD SCRAMBLE* 🔠\\n\\nUnscramble this word:\\n*--------------------*\\n* \${scrambled.toUpperCase()} *\\n*--------------------*\\n\\nReply or type \\\`scramble <guess>\\\` to answer.\\nType \\\`scramble end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out }, { quoted: msg });
      }

      if (cmd === 'end') {
        delete global.scrambleGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.scrambleGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`scramble start\` to play.' });

      if (cmd === game.word) {
        delete global.scrambleGames[chatId];
        return sock.sendMessage(chatId, { text: \`🎉 Correct! @\${sender.split('@')[0]} guessed it right!\\nThe word was *\${game.word.toUpperCase()}*\`, mentions: [sender] }, { quoted: msg });
      } else {
        return sock.sendMessage(chatId, { text: '❌ Wrong! Try again.' }, { quoted: msg });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['dice.js'] = `import { get } from '../../lib/db.js';

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
        if (global.diceGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`dice end\` to stop.' });

        let p2 = 'bot'; let isBot = true;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          p2 = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
          p2 = msg.message.extendedTextMessage.contextInfo.participant;
          isBot = false;
        }
        if (p2 === sender) return sock.sendMessage(chatId, { text: 'You can\\'t play yourself!' });

        global.diceGames[chatId] = { p1: sender, p2, isBot, turn: sender };

        const out = \`🎲 *DICE BATTLE* 🎲\\n\\n@\${sender.split('@')[0]} VS \${isBot ? '🤖 Bot' : \`@\${p2.split('@')[0]}\`}\\n\\nUse \\\`dice roll\\\` to roll.\\nFirst turn: @\${sender.split('@')[0]}\`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, isBot ? '' : p2] });
      }

      if (cmd === 'end') {
        delete global.diceGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.diceGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`dice start\` to play.' });

      if (cmd === 'roll') {
        if (game.turn !== sender) return sock.sendMessage(chatId, { text: \`Wait! It's @\${game.turn.split('@')[0]}'s turn.\`, mentions: [game.turn] });

        const roll1 = Math.floor(Math.random() * 6) + 1;
        
        let out = \`🎲 @\${sender.split('@')[0]} rolled a *\${roll1}*!\\n\\n\`;

        if (game.isBot) {
           const roll2 = Math.floor(Math.random() * 6) + 1;
           out += \`🎲 🤖 Bot rolled a *\${roll2}*!\\n\\n\`;
           
           if (roll1 > roll2) out += \`🎉 @\${sender.split('@')[0]} WINS!\`;
           else if (roll2 > roll1) out += \`🤖 Bot WINS!\`;
           else out += 'It\\'s a TIE! 🤝';
           
           delete global.diceGames[chatId];
           return sock.sendMessage(chatId, { text: out, mentions: [sender] });
        } else {
           if (!game.p1Roll) {
               game.p1Roll = roll1;
               game.turn = game.p2;
               out += \`Now it's @\${game.p2.split('@')[0]}'s turn!\`;
               return sock.sendMessage(chatId, { text: out, mentions: [sender, game.p2] });
           } else {
               const roll2 = roll1;
               const roll1Val = game.p1Roll;
               out = \`🎲 @\${game.p1.split('@')[0]} rolled: *\${roll1Val}*\\n\`;
               out += \`🎲 @\${game.p2.split('@')[0]} rolled: *\${roll2}*\\n\\n\`;
               
               if (roll1Val > roll2) out += \`🎉 @\${game.p1.split('@')[0]} WINS!\`;
               else if (roll2 > roll1Val) out += \`🎉 @\${game.p2.split('@')[0]} WINS!\`;
               else out += 'It\\'s a TIE! 🤝';

               delete global.diceGames[chatId];
               return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2] });
           }
        }
      }
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['higherlower.js'] = `import { get } from '../../lib/db.js';

global.hlGames = global.hlGames || {};

export default {
  name: 'higherlower',
  alias: ['hl'],
  desc: 'Higher or Lower Game',
  category: 'games',
  react: '📈',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.hlGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`hl end\` to stop.' });

        const num = Math.floor(Math.random() * 100) + 1;
        global.hlGames[chatId] = { num, player: sender, streak: 0 };

        const out = \`📈 *HIGHER OR LOWER* 📉\\n\\n@\${sender.split('@')[0]}, your starting number is *\${num}*!\\nIs the next number going to be \\\`hl higher\\\` or \\\`hl lower\\\`?\\n\\nType \\\`hl end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      }

      if (cmd === 'end') {
        delete global.hlGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.hlGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`hl start\` to play.' });

      if (game.player !== sender) return sock.sendMessage(chatId, { text: 'You are not the player!' });

      if (cmd === 'higher' || cmd === 'h' || cmd === 'lower' || cmd === 'l') {
        const nextNum = Math.floor(Math.random() * 100) + 1;
        const higher = nextNum >= game.num;
        
        const isHigherGuess = cmd.startsWith('h');
        
        let out = \`The next number is *\${nextNum}*!\\n\\n\`;

        if ((higher && isHigherGuess) || (!higher && !isHigherGuess)) {
           game.streak++;
           game.num = nextNum;
           out += \`✅ Correct! Your streak is *\${game.streak}*!\\nNext: \\\`hl higher\\\` or \\\`hl lower\\\`?\`;
           return sock.sendMessage(chatId, { text: out });
        } else {
           out += \`❌ Wrong! Game over! Your final streak was *\${game.streak}*.\\n\\nPlay again using \\\`hl start\\\`.\`;
           delete global.hlGames[chatId];
           return sock.sendMessage(chatId, { text: out });
        }
      }
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['guess.js'] = `import { get } from '../../lib/db.js';

global.guessGames = global.guessGames || {};

export default {
  name: 'guess',
  alias: ['guessnum'],
  desc: 'Guess the Number',
  category: 'games',
  react: '🔢',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.guessGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`guess end\` to stop.' });

        const num = Math.floor(Math.random() * 50) + 1;
        global.guessGames[chatId] = { num, attempts: 0 };

        const out = \`🔢 *GUESS THE NUMBER* 🔢\\n\\nI'm thinking of a number between 1 and 50.\\nUse \\\`guess <number>\\\` to try!\\n\\nType \\\`guess end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.guessGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.guessGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`guess start\` to play.' });

      const guess = parseInt(cmd);
      if (isNaN(guess)) return sock.sendMessage(chatId, { text: 'Send a number!' });

      game.attempts++;

      if (guess < game.num) {
         return sock.sendMessage(chatId, { text: '📈 Too Low! Try again.' });
      } else if (guess > game.num) {
         return sock.sendMessage(chatId, { text: '📉 Too High! Try again.' });
      } else {
         const out = \`🎉 @\${sender.split('@')[0]} guessed it right!\\nThe number was *\${game.num}*!\\nAttempts: \${game.attempts}\`;
         delete global.guessGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['numberguess.js'] = games['guess.js']; // Alias handling handled by router actually, skipping duplication, we'll drop numberguess.

games['math.js'] = `import { get } from '../../lib/db.js';

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
        if (global.mathGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`math end\` to stop.' });

        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const n1 = Math.floor(Math.random() * 50) + 1;
        const n2 = Math.floor(Math.random() * 20) + 1;
        const q = \`\${n1} \${op} \${n2}\`;
        const ans = eval(q);

        global.mathGames[chatId] = { ans };

        const out = \`➕ *MATH QUIZ* ➖\\n\\nWhat is: *\${q}* = ?\\n\\nUse \\\`math <answer>\\\` to answer.\\nType \\\`math end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.mathGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.mathGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`math start\` to play.' });

      const ans = parseInt(cmd);
      if (isNaN(ans)) return sock.sendMessage(chatId, { text: 'Send a number!' });

      if (ans === game.ans) {
         const out = \`🎉 @\${sender.split('@')[0]} is correct!\\nThe answer is *\${game.ans}*!\`;
         delete global.mathGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      } else {
         return sock.sendMessage(chatId, { text: '❌ wrong! Try again.' });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['wordle.js'] = `import { get } from '../../lib/db.js';

global.wordleGames = global.wordleGames || {};

const words = ['apple', 'grape', 'mango', 'peach', 'berry', 'plant', 'crane', 'train', 'brain', 'smart', 'cloud', 'phone', 'table', 'chair', 'house'];

export default {
  name: 'wordle',
  alias: ['wdl'],
  desc: 'Play Wordle',
  category: 'games',
  react: '🔠',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.wordleGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`wordle end\` to stop.' });

        const word = words[Math.floor(Math.random() * words.length)];
        global.wordleGames[chatId] = { word, attempts: 6, guesses: [], player: sender };

        const out = \`🔠 *WORDLE* 🔠\\n\\n@\${sender.split('@')[0]}, guess the 5-letter word!\\nYou have 6 attempts.\\n\\nUse \\\`wordle <5-letter-word>\\\` to guess.\\nType \\\`wordle end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      }

      if (cmd === 'end') {
        delete global.wordleGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.wordleGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`wordle start\` to play.' });

      if (game.player !== sender) return sock.sendMessage(chatId, { text: 'You are not the player!' });

      if (cmd.length !== 5) return sock.sendMessage(chatId, { text: 'Must be a 5-letter word!' });

      let result = '';
      for (let i = 0; i < 5; i++) {
         if (cmd[i] === game.word[i]) result += '🟩';
         else if (game.word.includes(cmd[i])) result += '🟨';
         else result += '⬛';
      }

      game.guesses.push(\`\${cmd.toUpperCase()} \${result}\`);
      game.attempts--;

      if (cmd === game.word) {
         const out = \`🔠 *WORDLE* 🔠\\n\\n\${game.guesses.join('\\n')}\\n\\n🎉 You guessed it!\`;
         delete global.wordleGames[chatId];
         return sock.sendMessage(chatId, { text: out });
      } else if (game.attempts === 0) {
         const out = \`🔠 *WORDLE* 🔠\\n\\n\${game.guesses.join('\\n')}\\n\\n❌ Game Over! The word was *\${game.word.toUpperCase()}*.\`;
         delete global.wordleGames[chatId];
         return sock.sendMessage(chatId, { text: out });
      } else {
         const out = \`🔠 *WORDLE* 🔠\\n\\n\${game.guesses.join('\\n')}\\n\\nAttempts left: \${game.attempts}\`;
         return sock.sendMessage(chatId, { text: out });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['trivia.js'] = `import { get } from '../../lib/db.js';

global.triviaGames = global.triviaGames || {};

const questions = [
  { q: "What is the capital of France?", a: "paris" },
  { q: "What is the largest planet?", a: "jupiter" },
  { q: "How many continents are there?", a: "7" },
  { q: "Who wrote Romeo and Juliet?", a: "shakespeare" },
  { q: "What is the chemical symbol for Gold?", a: "au" },
  { q: "What is H2O commonly known as?", a: "water" },
  { q: "In what year did the Titanic sink?", a: "1912" },
  { q: "What is 15 * 6?", a: "90" }
];

export default {
  name: 'trivia',
  alias: ['quiz'],
  desc: 'Play Trivia Quiz',
  category: 'games',
  react: '🧠',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args.join(' ').toLowerCase();

      if (cmd === 'start') {
        if (global.triviaGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`trivia end\` to stop.' });

        const q = questions[Math.floor(Math.random() * questions.length)];
        global.triviaGames[chatId] = { q: q.q, a: q.a, startedBy: sender };

        const out = \`🧠 *TRIVIA QUIZ* 🧠\\n\\n❓: *\${q.q}*\\n\\nUse \\\`trivia <answer>\\\` to play.\\nType \\\`trivia end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.triviaGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.triviaGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`trivia start\` to play.' });

      if (cmd === game.a) {
         const out = \`🎉 @\${sender.split('@')[0]} guessed it right!\\nAnswer: *\${game.a.toUpperCase()}*\`;
         delete global.triviaGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      } else {
         return sock.sendMessage(chatId, { text: '❌ Wrong! Try again.' });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['hangman.js'] = `import { get } from '../../lib/db.js';

global.hangmanGames = global.hangmanGames || {};

const words = ['javascript', 'typescript', 'developer', 'keyboard', 'monitor', 'internet', 'database', 'server', 'firewall', 'browser'];

export default {
  name: 'hangman',
  alias: ['hm'],
  desc: 'Play Hangman',
  category: 'games',
  react: '🕴️',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.hangmanGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`hangman end\` to stop.' });

        const word = words[Math.floor(Math.random() * words.length)];
        global.hangmanGames[chatId] = { word, guesses: [], mistakes: 0, maxMistakes: 6 };

        const hidden = word.split('').map(c => '_').join(' ');
        const out = \`🕴️ *HANGMAN* 🕴️\\n\\nWord: \${hidden}\\nMistakes: 0/6\\n\\nUse \\\`hangman <letter>\\\` to guess.\\nType \\\`hangman end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.hangmanGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.hangmanGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`hangman start\` to play.' });

      if (cmd.length !== 1 || !/[a-z]/.test(cmd)) return sock.sendMessage(chatId, { text: 'Send a single letter!' });

      if (game.guesses.includes(cmd)) return sock.sendMessage(chatId, { text: 'Already guessed!' });

      game.guesses.push(cmd);
      if (!game.word.includes(cmd)) game.mistakes++;

      const hidden = game.word.split('').map(c => game.guesses.includes(c) ? c : '_').join(' ');
      
      if (!hidden.includes('_')) {
         const out = \`🕴️ *HANGMAN* 🕴️\\n\\nWord: *\${game.word.toUpperCase()}*\\n\\n🎉 @\${sender.split('@')[0]} solved it!\`;
         delete global.hangmanGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      } else if (game.mistakes >= game.maxMistakes) {
         const out = \`🕴️ *HANGMAN* 🕴️\\n\\n❌ Game Over! The word was *\${game.word.toUpperCase()}*.\`;
         delete global.hangmanGames[chatId];
         return sock.sendMessage(chatId, { text: out });
      } else {
         const out = \`🕴️ *HANGMAN* 🕴️\\n\\nWord: \${hidden}\\nMistakes: \${game.mistakes}/6\\nGuessed: \${game.guesses.join(', ')}\`;
         return sock.sendMessage(chatId, { text: out });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['slots.js'] = `import { get } from '../../lib/db.js';

export default {
  name: 'slots',
  alias: ['slotmachine'],
  desc: 'Play Slot Machine',
  category: 'games',
  react: '🎰',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;

      const items = ['🍒', '🍋', '🍉', '🍇', '🔔', '💎', '7️⃣'];
      const r1 = items[Math.floor(Math.random() * items.length)];
      const r2 = items[Math.floor(Math.random() * items.length)];
      const r3 = items[Math.floor(Math.random() * items.length)];

      let out = \`🎰 *SLOT MACHINE* 🎰\\n\\n[ \${r1} | \${r2} | \${r3} ]\\n\\n\`;

      if (r1 === r2 && r2 === r3) {
         out += \`🎉 JACKPOT! @\${sender.split('@')[0]} WINS!\`;
      } else if (r1 === r2 || r2 === r3 || r1 === r3) {
         out += \`✨ Small win! @\${sender.split('@')[0]} got 2 matching.\`;
      } else {
         out += \`❌ You lose. Try again!\`;
      }

      await sock.sendMessage(chatId, { text: out, mentions: [sender] });

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;


for (const [key, value] of Object.entries(games)) {
    fs.writeFileSync(path.join(gamesDir, key), value);
}

// Clean up old ones that might conflict or be incomplete if we want
const removeFiles = ['flip.js'];
removeFiles.forEach(f => {
    const p = path.join(gamesDir, f);
    if(fs.existsSync(p)) {
        fs.unlinkSync(p);
    }
});

console.log('Successfully generated robust logical games');
