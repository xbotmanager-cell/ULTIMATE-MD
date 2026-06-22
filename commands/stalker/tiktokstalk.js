import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'tiktokstalk',
  alias: ['stalktiktok', 'ttstalk', 'tiktokprofile'],
  desc: 'Stalk a TikTok profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid TikTok username!' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = '0';
         let following = '0';
         let likes = '0';
         let videos = '0';
         let friends = '0';

         const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };
         try {
             const res = await axios.get(`https://www.tikwm.com/api/user/info?unique_id=${encodeURIComponent(username)}`, axiosConfig);
             if (res.data && res.data.data && res.data.data.user) {
                 const data = res.data.data;
                 picUrl = data.user.avatarLarger || data.user.avatarMedium || data.user.avatarThumb || '';
                 fullName = data.user.nickname || username;
                 bioData = data.user.signature || 'No bio';
                 followers = data.stats.followerCount || '0';
                 following = data.stats.followingCount || '0';
                 likes = data.stats.heartCount || '0';
                 videos = data.stats.videoCount || '0';
                 friends = data.stats.friendCount || '0';
             } else {
                 throw new Error('Not found');
             }
         } catch(e) { 
             try {
                 const res = await axios.get(`https://bk9.fun/stalk/tiktok?q=${encodeURIComponent(username)}`, axiosConfig);
                 if (res.data?.status && res.data?.BK9) {
                     const data = res.data.BK9;
                     picUrl = data.avatar || '';
                     fullName = data.nickname || username;
                     bioData = data.signature || 'No bio';
                     followers = data.followerCount || '0';
                     following = data.followingCount || '0';
                     likes = data.heartCount || '0';
                     videos = data.videoCount || '0';
                     friends = data.friendCount || '0';
                 } else {
                     return sock.sendMessage(msg.key.remoteJid, { text: 'TikTok user not found or API is down! 😭' }, { quoted: msg });
                 }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'TikTok APIs are heavily restricted down, couldn\'t stalk!' }, { quoted: msg });
             }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'TIKTOK'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴɪᴄᴋɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ʟɪᴋᴇs', String(likes)),
            formatLine('ᴠɪᴅᴇᴏs', String(videos)),
            formatLine('ғʀɪᴇɴᴅs', String(friends)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', `tiktok.com/@${username}`)
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