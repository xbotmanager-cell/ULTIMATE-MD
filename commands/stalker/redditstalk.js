import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'redditstalk',
  alias: ['stalkreddit'],
  desc: 'Stalk a Reddit profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '').replace('u/', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Reddit username!' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let karma = '0';
         let created = 'N/A';

         const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };
         try {
             // Reddit doesn't require auth for basic public user lookup via /about.json
             const res = await axios.get(`https://www.reddit.com/user/${encodeURIComponent(username)}/about.json`, axiosConfig);
             if (res.data?.data) {
                 const data = res.data.data;
                 picUrl = data.icon_img?.split('?')[0] || data.snoovatar_img || '';
                 fullName = data.name || username;
                 bioData = data.subreddit?.public_description || 'No bio';
                 karma = data.total_karma;
                 created = new Date(data.created_utc * 1000).toDateString();
             } else {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'Reddit user not found! 😭' }, { quoted: msg });
             }
         } catch(e) {
             return sock.sendMessage(msg.key.remoteJid, { text: `Reddit API down. Direct link: reddit.com/user/${username}` }, { quoted: msg });
         }

         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'REDDIT'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ᴋᴀʀᴍᴀ', String(karma)),
            formatLine('ᴄʀᴇᴀᴛᴇᴅ', String(created)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', `reddit.com/user/${username}`)
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