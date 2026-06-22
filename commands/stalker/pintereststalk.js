import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'pintereststalk',
  alias: ['stalkpinterest', 'pinstalk'],
  desc: 'Stalk a Pinterest profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Pinterest username!' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = 'N/A';
         let following = 'N/A';

         const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };
         try {
             const res = await axios.get(`https://api.popcat.xyz/pinterest?user=${encodeURIComponent(username)}`, axiosConfig);
             if (res.data?.full_name) {
                 picUrl = res.data.profile_pic || '';
                 fullName = res.data.full_name || username;
                 bioData = res.data.biography || 'No bio';
                 followers = res.data.followers;
                 following = res.data.following;
             } else {
                 throw new Error('Not found');
             }
         } catch(e) { 
             try {
                 const res = await axios.get(`https://bk9.fun/stalk/pinterest?q=${encodeURIComponent(username)}`);
                 if(res.data?.BK9) {
                     picUrl = res.data.BK9.profile_image_url || '';
                     fullName = res.data.BK9.full_name || username;
                     bioData = res.data.BK9.about || 'No bio';
                     followers = res.data.BK9.follower_count || 'Private';
                     following = res.data.BK9.following_count || 'Private';
                 } else { throw new Error('Not found') }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: `Pinterest API down. Direct link: pinterest.com/${username}` }, { quoted: msg });
             }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'PINTEREST'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', `pinterest.com/${username}`)
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