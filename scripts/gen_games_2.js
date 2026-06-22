import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const gamesDir = path.join(baseDir, 'commands', 'games');

const games = {};

games['cointoss.js'] = `import { get } from '../../lib/db.js';

export default {
  name: 'cointoss',
  alias: ['coinflip', 'toss', 'flip'],
  desc: 'Toss a coin',
  category: 'games',
  react: '🪙',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      
      const coins = ['Heads 🪙', 'Tails 🪙'];
      const result = coins[Math.floor(Math.random() * coins.length)];

      await sock.sendMessage(chatId, { text: \`@\${sender.split('@')[0]} flipped a coin...\\n\\nIt landed on: *\${result}*!\`, mentions: [sender] });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['russianroulette.js'] = `import { get } from '../../lib/db.js';

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
        if (global.rrGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`rr end\` to stop.' });

        let p2 = 'bot'; let isBot = true;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
          p2 = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
          isBot = false;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            p2 = msg.message.extendedTextMessage.contextInfo.participant;
            isBot = false;
        }
        if (p2 === sender) return sock.sendMessage(chatId, { text: 'You can\\'t play yourself!' });

        const bulletIndex = Math.floor(Math.random() * 6);
        global.rrGames[chatId] = { p1: sender, p2, isBot, turn: sender, position: 0, bulletIndex };

        const out = \`🔫 *RUSSIAN ROULETTE* 🔫\\n\\n@\${sender.split('@')[0]} VS \${isBot ? '🤖 Bot' : \`@\${p2.split('@')[0]}\`}\\n\\nUse \\\`rr pull\\\` to pull the trigger.\\nFirst turn: @\${sender.split('@')[0]}\`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, isBot ? '' : p2] });
      }

      if (cmd === 'end') {
        delete global.rrGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.rrGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`rr start\` to play.' });

      if (cmd === 'pull') {
        if (game.turn !== sender) return sock.sendMessage(chatId, { text: \`Wait! It's @\${game.turn.split('@')[0]}'s turn.\`, mentions: [game.turn] });

        let out = \`🔫 @\${sender.split('@')[0]} points the gun and pulls the trigger...\\n\\n\`;

        if (game.position === game.bulletIndex) {
            out += \`💥 *BANG!*\\n\\n@\${sender.split('@')[0]} died! 🎉 @\${(game.turn === game.p1 ? game.p2 : game.p1).split('@')[0]} WINS!\`;
            delete global.rrGames[chatId];
            return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2] });
        } else {
            out += \`*Click.* Only empty chamber.\\n\\n\`;
            game.position++;
            game.turn = game.turn === game.p1 ? game.p2 : game.p1;
            
            if (game.isBot) {
               out += \`Now it's 🤖 Bot's turn! Pulling trigger...\\n\`;
               if (game.position === game.bulletIndex) {
                   out += \`💥 *BANG!*\\n\\nBot died! 🎉 @\${game.p1.split('@')[0]} WINS!\`;
                   delete global.rrGames[chatId];
                   return sock.sendMessage(chatId, { text: out, mentions: [game.p1] });
               } else {
                   out += \`*Click.* Bot survives.\\n\\nNow it's your turn @\${game.p1.split('@')[0]}! Use \\\`rr pull\\\`\`;
                   game.position++;
                   game.turn = game.p1;
                   return sock.sendMessage(chatId, { text: out, mentions: [game.p1] });
               }
            } else {
               out += \`Now it's @\${game.turn.split('@')[0]}'s turn! Use \\\`rr pull\\\`\`;
               return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2] });
            }
        }
      }
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['typing.js'] = `import { get } from '../../lib/db.js';

global.typingGames = global.typingGames || {};

const phrases = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "Patience is a key element of success.",
  "Never gonna give you up.",
  "May the Force be with you."
];

export default {
  name: 'typing',
  alias: ['typefast'],
  desc: 'Typing Speed Challenge',
  category: 'games',
  react: '⌨️',
  execute: async (sock, msg, args) => {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const cmd = args[0] ? args[0].toLowerCase() : '';

      if (cmd === 'start') {
        if (global.typingGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`typing end\` to stop.' });

        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        global.typingGames[chatId] = { phrase, startTime: Date.now(), player: sender };

        const out = \`⌨️ *TYPING CHALLENGE* ⌨️\\n\\nType the exact sentence below as fast as possible:\\n\\n*\${phrase}*\\n\\nUse \\\`typing <your text>\\\`\\nType \\\`typing end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      }

      if (cmd === 'end') {
        delete global.typingGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.typingGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`typing start\` to play.' });

      if (game.player !== sender) return sock.sendMessage(chatId, { text: 'Only the one who started can type!' });

      const attempt = args.join(' ');
      if (attempt === game.phrase) {
         const timeTaken = ((Date.now() - game.startTime) / 1000).toFixed(2);
         const wpm = Math.floor((game.phrase.split(' ').length / timeTaken) * 60);

         const out = \`⌨️ *TYPING CHALLENGE* ⌨️\\n\\n🎉 Flawless!\\nTime: *\${timeTaken}s*\\nSpeed: *\${wpm} WPM*\`;
         delete global.typingGames[chatId];
         return sock.sendMessage(chatId, { text: out });
      } else {
         return sock.sendMessage(chatId, { text: '❌ Incorrect! Check caps and punctuation.' });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['anagram.js'] = `import { get } from '../../lib/db.js';

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
        if (global.anagramGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`anagram end\` to stop.' });

        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        global.anagramGames[chatId] = { word: pair.w, ans: pair.a, startedBy: sender };

        const out = \`🔄 *ANAGRAM* 🔄\\n\\nFind a valid word with the exact same letters as:\\n\\n*\${pair.w.toUpperCase()}*\\n\\nUse \\\`anagram <word>\\\` to guess.\\nType \\\`anagram end\\\` to stop.\`;
        return sock.sendMessage(chatId, { text: out });
      }

      if (cmd === 'end') {
        delete global.anagramGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' });
      }

      const game = global.anagramGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`anagram start\` to play.' });

      if (cmd === game.ans) {
         const out = \`🎉 @\${sender.split('@')[0]} got it!\\nThe anagram is *\${game.ans.toUpperCase()}*\`;
         delete global.anagramGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [sender] });
      } else {
         return sock.sendMessage(chatId, { text: '❌ Wrong! Not the anagram I\\'m thinking of.' });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

games['rpsls.js'] = `import { get } from '../../lib/db.js';

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
        if (global.rpslsGames[chatId]) return sock.sendMessage(chatId, { text: 'Game running! \`rpsls end\` to stop.' }, { quoted: msg });

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

        const out = \`🖖 *RPSLS* 🦎\\n\\n@\${sender.split('@')[0]} VS \${isBot ? '🤖 Bot' : \`@\${p2.split('@')[0]}\`}\\n\\nPlayers, PM the bot directly or use \\\`rpsls rock/paper/scissors/lizard/spock\\\` here.\\n*Hint:* Sending in group is public!\`;
        return sock.sendMessage(chatId, { text: out, mentions: [sender, isBot ? '' : p2] }, { quoted: msg });
      }

      if (cmd === 'end') {
        delete global.rpslsGames[chatId];
        return sock.sendMessage(chatId, { text: 'Game stopped! 🛑' }, { quoted: msg });
      }

      const game = global.rpslsGames[chatId];
      if (!game) return sock.sendMessage(chatId, { text: 'No game! \`rpsls start\` to play.' }, { quoted: msg });

      if (!choices.includes(cmd)) return sock.sendMessage(chatId, { text: 'Choose rock, paper, scissors, lizard, or spock!' }, { quoted: msg });

      if (sender === game.p1) game.p1Choice = cmd;
      else if (sender === game.p2) game.p2Choice = cmd;
      else return sock.sendMessage(chatId, { text: 'You are not in this game!' }, { quoted: msg });

      sock.sendMessage(chatId, { text: \`@\${sender.split('@')[0]} has locked their choice! 🔒\`, mentions: [sender] }, { quoted: msg });

      if (game.p1Choice && game.p2Choice) {
         const winner = getWinner(game.p1Choice, game.p2Choice);
         let out = \`🖖 *RPSLS RESULT* 🦎\\n\\n@\${game.p1.split('@')[0]} chose \${emojis[game.p1Choice]}\\n\`;
         out += game.isBot ? \`🤖 Bot chose \${emojis[game.p2Choice]}\\n\\n\` : \`@\${game.p2.split('@')[0]} chose \${emojis[game.p2Choice]}\\n\\n\`;
         
         if (winner === 'tie') out += 'It\\'s a TIE! 🤝';
         else if (winner === 'p1') out += \`🎉 @\${game.p1.split('@')[0]} WON!\`;
         else out += game.isBot ? '🤖 Bot WON! 💥' : \`🎉 @\${game.p2.split('@')[0]} WON!\`;

         delete global.rpslsGames[chatId];
         return sock.sendMessage(chatId, { text: out, mentions: [game.p1, game.p2].filter(x => x && x !== 'bot') });
      }

    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Crash! 🤡' });
    }
  }
};`;

for (const [key, value] of Object.entries(games)) {
    fs.writeFileSync(path.join(gamesDir, key), value);
}

console.log('Successfully generated more robust logical games');
