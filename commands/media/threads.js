import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'threads',
  alias: ['threadsdl', 'threadsdown'],
  desc: 'Download media from THREADS',
  category: 'media',
  execute: async (sock, msg, args) => {
      try {
         let url = args.join(' ');
         if (!url && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
             url = msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
         } else if (!url && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text) {
             url = msg.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text;
         }

         if (!url) return sock.sendMessage(msg.key.remoteJid, { text: 'Bruh, provide a valid threads link or reply to one!' }, { quoted: msg });
         
         const urlRegex = /(https?:\/\/[^\s]+)/g;
         const urls = url.match(urlRegex);
         if (!urls) return sock.sendMessage(msg.key.remoteJid, { text: 'I couldn\'t find a valid link in that! 🤡' }, { quoted: msg });
         url = urls[0];

         await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Fetching threads media... hang tight.' }, { quoted: msg });

         let finalUrl = '';
         let captionText = 'Downloaded via ULTIMATE-MD';
         
         if ('threads' === 'tiktok') {
            try {
               const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
               if (res.data?.data?.play) {
                   finalUrl = res.data.data.play;
                   captionText = res.data.data.title || captionText;
               } else { throw new Error('Not found'); }
            } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'TikTok download failed! No video found or API down. 😭' }, { quoted: msg }); }
         } else if ('threads' === 'instagram' || 'threads' === 'facebook' || 'threads' === 'twitter') {
            try {
               const res = await axios.get(`https://api.akuari.my.id/downloader/${'threads' === 'instagram' ? 'igdl' : 'threads'}?link=${encodeURIComponent(url)}`);
               if (res.data?.result?.url || res.data?.url?.[0]?.url) {
                   finalUrl = res.data.result?.url || res.data.url[0].url;
               } else { throw new Error('Not found'); }
            } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'THREADS download failed! Try another link. 😭' }, { quoted: msg }); }
         } else {
             return sock.sendMessage(msg.key.remoteJid, { text: 'Downloading from THREADS is temporarily unavailable!' }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴏᴏʟ', 'THREADS DOWNLOADER'),
            formatLine('ᴅᴇᴛᴀɪʟ', captionText.substring(0, 30) + '...')
         ]);

         if (finalUrl.includes('.mp4') || finalUrl.startsWith('https://')) {
             await sock.sendMessage(msg.key.remoteJid, { video: { url: finalUrl }, caption: box }, { quoted: msg });
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Downloading threads just crashed my tiny server brain 😭.' }, { quoted: msg });
      }
  }
};