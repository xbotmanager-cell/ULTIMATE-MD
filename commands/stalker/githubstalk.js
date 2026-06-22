import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'githubstalk',
  alias: ['stalkgithub'],
  desc: 'Stalk profile for github',
  category: 'stalker',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid username to stalk!' }, { quoted: msg });

         const target = cmd === 'githubstalk' ? 'github' : 'github';
         const apiSources = [];
         
         if (target === 'github') {
             apiSources.push({ url: `https://api.github.com/users/${encodeURIComponent(username)}`, pic: 'avatar_url', name: 'name', bio: 'bio', followers: 'followers' });
         } else {
             for(let i=1; i<=20; i++) {
                 apiSources.push({ url: `https://api${i}.example.com/${target}stalk?user=${encodeURIComponent(username)}`, pic: 'profile_pic', name: 'fullname', bio: 'description', followers: 'followers_count' });
             }
         }

         apiSources.sort(() => Math.random() - 0.5);

         await sock.sendMessage(msg.key.remoteJid, { text: '🕵️ Fetching profile details...' }, { quoted: msg });

         let picUrl = 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followersData = '0';
         let usedApi = 'Fallback';

         for (let i = 0; i < apiSources.length; i++) {
            try {
               const res = await axios.get(apiSources[i].url, { timeout: 3000 });
               if (res.data) {
                  const d = res.data;
                  if (d[apiSources[i].pic]) picUrl = d[apiSources[i].pic];
                  if (d[apiSources[i].name]) fullName = d[apiSources[i].name];
                  if (d[apiSources[i].bio]) bioData = d[apiSources[i].bio];
                  if (d[apiSources[i].followers]) followersData = d[apiSources[i].followers];
                  
                  let u = new URL(apiSources[i].url);
                  usedApi = u.hostname;
                  break;
               }
            } catch (e) {
               continue;
            }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', target.toUpperCase()),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', String(fullName).substring(0, 20)),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followersData)),
            formatLine('ʙɪᴏ', String(bioData).substring(0, 25))
         ]);

         await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl }, caption: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in githubstalk.' }, { quoted: msg });
      }
  }
};
