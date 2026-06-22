import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'robloxstalk',
  alias: ['stalkroblox', 'rbxstalk'],
  desc: 'Stalk a Roblox profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Roblox username!' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let created = 'N/A';
         let isBanned = 'False';

         const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };
         try {
             // Use Roblox search API for UID then data API
             const searchRes = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`, axiosConfig);
             if (searchRes.data?.data?.length > 0) {
                 const uid = searchRes.data.data[0].id;
                 const userRes = await axios.get(`https://users.roblox.com/v1/users/${uid}`, axiosConfig);
                 if (userRes.data) {
                     fullName = userRes.data.displayName || userRes.data.name;
                     bioData = userRes.data.description || 'No description';
                     created = new Date(userRes.data.created).toDateString();
                     isBanned = userRes.data.isBanned ? 'True' : 'False';
                     
                     // Get Thumbnail
                     try {
                         const thumbRes = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${uid}&size=720x720&format=Png&isCircular=false`, axiosConfig);
                         picUrl = thumbRes.data?.data?.[0]?.imageUrl || '';
                     } catch(err){}
                 }
             } else {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'Roblox user not found! 😭' }, { quoted: msg });
             }
         } catch(e) {
             return sock.sendMessage(msg.key.remoteJid, { text: `Roblox API down. Direct link: roblox.com/users` }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'ROBLOX'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ᴄʀᴇᴀᴛᴇᴅ', String(created)),
            formatLine('ʙᴀɴɴᴇᴅ', String(isBanned)),
            formatLine('ʙɪᴏ', String(bioData).substring(0, 50)),
            formatLine('ʟɪɴᴋ', `roblox.com/search/users?keyword=${username}`)
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