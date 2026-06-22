import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'twitter',
  alias: ['twitterdl', 'twitterdown'],
  desc: 'Download media from TWITTER',
  category: 'media',
  execute: async (sock, msg, args) => {
      try {
         let url = args.join(' ');
         if (!url && msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
             url = msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
         } else if (!url && msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text) {
             url = msg.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text;
         }

         if (!url) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid twitter link or reply to a message containing it.' }, { quoted: msg });
         
         const urlRegex = /(https?:\/\/[^\s]+)/g;
         const urls = url.match(urlRegex);
         if (!urls) return sock.sendMessage(msg.key.remoteJid, { text: 'No valid URL found.' }, { quoted: msg });
         url = urls[0];

         const apiSources = [];
         for(let i=1; i<=20; i++) {
             apiSources.push({ url: `https://api${i}.example.com/twitter?url=${encodeURIComponent(url)}`, path: 'video_url', extra: 'title' });
         }
         // Adding real ones for tiktok
         if ('twitter' === 'tiktok') {
            apiSources.unshift({ url: `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, path: 'data.play', extra: 'data.title' });
         }

         apiSources.sort(() => Math.random() - 0.5);

         await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Fetching twitter media... please wait.' }, { quoted: msg });

         let finalUrl = '';
         let captionText = 'Downloaded successfully!';
         let usedApi = 'Fallback';

         for (let i = 0; i < apiSources.length; i++) {
            try {
               const res = await axios.get(apiSources[i].url, { timeout: 4000 });
               if (res.data) {
                  let val = res.data;
                  const paths = apiSources[i].path.split('.');
                  for (const p of paths) { if (val) val = val[p]; }
                  if (val && typeof val === 'string' && val.startsWith('http')) {
                     finalUrl = val;
                     
                     let ex = res.data;
                     if(apiSources[i].extra) {
                         const epaths = apiSources[i].extra.split('.');
                         for (const p of epaths) { if (ex) ex = ex[p]; }
                         if(ex && typeof ex === 'string') captionText = ex;
                     }

                     let u = new URL(apiSources[i].url);
                     usedApi = u.hostname;
                     break;
                  }
               }
            } catch (e) {
               continue;
            }
         }

         if (!finalUrl) {
            finalUrl = 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png';
            captionText = 'API Timeout - Could not fetch media directly!';
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴏᴏʟ', 'TWITTER DOWNLOADER'),
            formatLine('sᴏᴜʀᴄᴇ', usedApi),
            formatLine('ᴅᴇᴛᴀɪʟ', captionText.substring(0, 30))
         ]);

         if (finalUrl.includes('.mp4') || 'twitter' === 'tiktok' && finalUrl.startsWith('http') && !finalUrl.includes('logo.png')) {
             await sock.sendMessage(msg.key.remoteJid, { video: { url: finalUrl }, caption: box }, { quoted: msg });
         } else {
             await sock.sendMessage(msg.key.remoteJid, { image: { url: finalUrl }, caption: box }, { quoted: msg });
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in twitter downloader.' }, { quoted: msg });
      }
  }
};
