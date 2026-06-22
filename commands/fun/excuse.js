import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'excuse',
  desc: 'Fun command to get random excuse',
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
                 'Why don\'t skeletons fight each other? They don\'t have the guts.',
                 'Did you know? Water is essentially a liquid.',
                 'Are you a magician? Because whenever I look at you, everyone else disappears!',
                 'My phone battery lasts longer than your relationships.',
                 'If I had a nickel for every time I saw someone as beautiful as you, I\'d have 5 cents.',
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
            formatLine('ғᴜɴ', 'EXCUSE'),
            formatLine('ʀᴇsᴜʟᴛ', result),
            formatLine('sᴏᴜʀᴄᴇ', apiSrc)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Yikes, executing excuse went completely sideways 😂.' }, { quoted: msg });
      }
  }
};
