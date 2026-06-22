import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'igstalk',
  alias: ['stalkig', 'instagramstalk'],
  desc: 'Stalk an Instagram profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid IG username!' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = '0';
         let following = '0';
         let posts = '0';

         const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };
         try {
             const res = await axios.get(`https://api.popcat.xyz/instagram?user=${encodeURIComponent(username)}`, axiosConfig);
             if (res.data && res.data.full_name) {
                 picUrl = res.data.profile_pic;
                 fullName = res.data.full_name;
                 bioData = res.data.biography || 'No bio';
                 followers = res.data.followers;
                 following = res.data.following;
                 posts = res.data.posts;
             } else {
                 throw new Error('Not found');
             }
         } catch(e) { 
             try {
                 const res = await axios.get(`https://bk9.fun/stalk/instagram?q=${encodeURIComponent(username)}`, axiosConfig);
                 if (res.data?.BK9) {
                     picUrl = res.data.BK9.profile_pic_url || '';
                     fullName = res.data.BK9.full_name || username;
                     bioData = res.data.BK9.biography || 'No bio';
                     followers = res.data.BK9.edge_followed_by?.count || '0';
                     following = res.data.BK9.edge_follow?.count || '0';
                     posts = res.data.BK9.edge_owner_to_timeline_media?.count || '0';
                 } else {
                     return sock.sendMessage(msg.key.remoteJid, { text: 'IG user not found! 😭' }, { quoted: msg });
                 }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'IG APIs down, couldn\'t stalk!' }, { quoted: msg });
             }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'INSTAGRAM'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ᴘᴏsᴛs', String(posts)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', `instagram.com/${username}`)
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