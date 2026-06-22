import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'githubstalk',
  alias: ['stalkgithub', 'ghstalk'],
  desc: 'Stalk a GitHub profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid GitHub username!' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = '0';
         let following = '0';
         let repos = '0';
         let company = 'N/A';

         const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };
         try {
             const res = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`, axiosConfig);
             if (res.data && res.data.login) {
                 picUrl = res.data.avatar_url;
                 fullName = res.data.name || res.data.login;
                 bioData = res.data.bio || 'No bio';
                 followers = res.data.followers;
                 following = res.data.following;
                 repos = res.data.public_repos;
                 company = res.data.company || 'None';
             } else {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'User not found! 😭' }, { quoted: msg });
             }
         } catch(e) { 
             try {
                 const res = await axios.get(`https://bk9.fun/stalk/github?q=${encodeURIComponent(username)}`);
                 if(res.data?.BK9) {
                     picUrl = res.data.BK9.avatar_url;
                     fullName = res.data.BK9.name || res.data.BK9.login;
                     bioData = res.data.BK9.bio || 'No bio';
                     followers = res.data.BK9.followers;
                     following = res.data.BK9.following;
                     repos = res.data.BK9.public_repos;
                     company = res.data.BK9.company || 'None';
                 } else { throw new Error('Not found') }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'GitHub API down, couldn\'t stalk!' }, { quoted: msg });
             }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'GITHUB'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ʀᴇᴘᴏs', String(repos)),
            formatLine('ᴄᴏᴍᴘᴀɴʏ', String(company)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', `github.com/${username}`)
         ]);

         if (picUrl) {
             await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl }, caption: box }, { quoted: msg });
         } else {
             await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};