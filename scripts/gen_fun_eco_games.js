import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const funDir = path.join(baseDir, 'commands', 'fun');
const ecoDir = path.join(baseDir, 'commands', 'economy');
const gamesDir = path.join(baseDir, 'commands', 'games');

[funDir, ecoDir, gamesDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const funCmds = [
  'joke', 'fact', 'rizz', 'roast', 'pickup', 'quote', '8ball', 'truth', 'dare', 'horoscope',
  'advice', 'compliment', 'trivia', 'catfact', 'dogfact', 'bored', 'uselessfact', 'insult', 'hacker', 'excuse'
];

funCmds.forEach(cmd => {
   const c = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: '${cmd}',
  desc: 'Fun command to get random ${cmd}',
  category: 'fun',
  execute: async (sock, msg, args) => {
      try {
         const botname = get('botname') || 'ULTIMATE-MD';
         let result = 'No fun right now!';
         let apiSrc = 'Fallback API';

         try {
             // Mock API responses since this is a demonstration
             // Real APIs could be used like: axios.get('some-fun-api.com')
             const dummyResp = [
                 'Why don\\'t skeletons fight each other? They don\\'t have the guts.',
                 'Did you know? Water is essentially a liquid.',
                 'Are you a magician? Because whenever I look at you, everyone else disappears!',
                 'My phone battery lasts longer than your relationships.',
                 'If I had a nickel for every time I saw someone as beautiful as you, I\\'d have 5 cents.',
                 'Be yourself; everyone else is already taken.',
                 'Outlook good.', 'Tell me your biggest secret.', 'I dare you to text your crush.',
                 'Taurus: You will find something interesting today.', 'Stay hydrated.',
                 'You have a great sense of humor!', 'The longest English word is 189,819 letters long.',
                 'Cats spend 70% of their lives sleeping.', 'Dogs dream just like humans do.',
                 'Read a book.', 'Banging your head against a wall burns 150 calories an hour.',
                 'You are roughly as useful as a screen door on a submarine.',
                 'Accessing mainframe... bypassing firewall... downloaded 5TB of cat memes.',
                 'My dog ate my homework.'
             ];
             result = dummyResp[Math.floor(Math.random() * dummyResp.length)];
             apiSrc = 'Local Random';
         } catch(e) {}

         const box = createBox(botname, [
            formatLine('ғᴜɴ', '${cmd.toUpperCase()}'),
            formatLine('ʀᴇsᴜʟᴛ', result),
            formatLine('sᴏᴜʀᴄᴇ', apiSrc)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error executing ${cmd}.' }, { quoted: msg });
      }
  }
};
`;
   fs.writeFileSync(path.join(funDir, `${cmd}.js`), c);
});

const ecoCmds = [
  'balance', 'work', 'deposit', 'withdraw', 'transfer', 'buy', 'shop', 'inventory', 'daily', 'weekly'
];

ecoCmds.forEach(cmd => {
   const c = `import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: '${cmd}',
  desc: 'Economy command for ${cmd}',
  category: 'economy',
  execute: async (sock, msg, args) => {
      try {
         const jid = msg.key.participant || msg.key.remoteJid;
         const botname = get('botname') || 'ULTIMATE-MD';
         
         // simple local balance placeholder system
         let balanceKey = jid + '_balance';
         let balance = get(balanceKey) || 0;

         let result = '';

         if ('${cmd}' === 'balance') {
             result = \\\`You currently have \${balance} 💰 coins\\\`;
         } else if ('${cmd}' === 'work') {
             const earned = Math.floor(Math.random() * 500) + 100;
             balance += earned;
             await set(balanceKey, balance);
             result = \\\`You worked hard and earned \${earned} 💰! New balance: \${balance}\\\`;
         } else if ('${cmd}' === 'daily') {
             result = \\\`You claimed your daily 1000 💰!\\\`;
             balance += 1000;
             await set(balanceKey, balance);
         } else {
             result = \\\`${cmd.toUpperCase()} function is coming soon!\\\`;
         }

         const box = createBox('ᴇᴄᴏɴᴏᴍʏ 💸', [
            formatLine('ᴜsᴇʀ', jid.split('@')[0]),
            formatLine('ᴀᴄᴛɪᴏɴ', '${cmd.toUpperCase()}'),
            formatLine('ɪɴғᴏ', result)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in economy.' }, { quoted: msg });
      }
  }
};
`;
   fs.writeFileSync(path.join(ecoDir, `${cmd}.js`), c);
});

const gameCmds = [
  'math', 'guess', 'rps', 'flip', 'dice'
];

gameCmds.forEach(cmd => {
   const c = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: '${cmd}',
  desc: 'Game command for ${cmd}',
  category: 'games',
  execute: async (sock, msg, args) => {
      try {
         const input = args[0]?.toLowerCase();
         const botname = get('botname') || 'ULTIMATE-MD';
         let result = '';

         if ('${cmd}' === 'math') {
             result = 'What is 8 * 7? Reply with the answer! (Hint: 56)';
         } else if ('${cmd}' === 'rps') {
             const choices = ['rock', 'paper', 'scissors'];
             const botChoice = choices[Math.floor(Math.random() * 3)];
             if(!input) result = 'Choose rock, paper, or scissors!';
             else result = \\\`You chose \${input}, I chose \${botChoice}. It's a game!\\\`;
         } else if ('${cmd}' === 'flip') {
             result = 'Coin landed on: ' + (Math.random() > 0.5 ? 'Heads' : 'Tails');
         } else if ('${cmd}' === 'dice') {
             const val = Math.floor(Math.random() * 6) + 1;
             result = \\\`You rolled a \${val} 🎲\\\`;
         } else {
             result = 'Play with me later!';
         }

         const box = createBox('ɢᴀᴍᴇs 🎮', [
            formatLine('ɢᴀᴍᴇ', '${cmd.toUpperCase()}'),
            formatLine('ɪɴғᴏ', result)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in game.' }, { quoted: msg });
      }
  }
};
`;
   fs.writeFileSync(path.join(gamesDir, `${cmd}.js`), c);
});

console.log('Successfully generated 35 new fun, games, and economy commands!');
