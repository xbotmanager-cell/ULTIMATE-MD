import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'twitterstalk',
  alias: ['stalktwitter', 'xstalk'],
  desc: 'Stalk a Twitter/X profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Twitter username!' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = 'N/A';
         let following = 'N/A';

         const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };
         try {
             const res = await axios.get(`https://bk9.fun/stalk/twitter?q=${encodeURIComponent(username)}`, axiosConfig);
             if (res.data?.status && res.data?.BK9) {
                 const data = res.data.BK9;
                 picUrl = data.profile_image_url || '';
                 fullName = data.name || username;
                 bioData = data.description || 'No bio';
                 followers = data.public_metrics?.followers_count || 'Private/Unknown';
                 following = data.public_metrics?.following_count || 'Private/Unknown';
             } else {
                 throw new Error('Not found');
             }
         } catch(e) {
             return sock.sendMessage(msg.key.remoteJid, { text: `Twitter API down. Direct link: x.com/${username}` }, { quoted: msg });
         }

         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'TWITTER/X'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', `x.com/${username}`)
         ]);

         if (picUrl) {
             await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl.replace('_normal', '') }, caption: box }, { quoted: msg });
         } else {
             await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};