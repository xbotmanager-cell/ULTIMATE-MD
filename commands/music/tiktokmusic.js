import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import yts from 'yt-search';
import axios from 'axios';

export default {
  name: 'tiktokmusic',
  alias: ['tiktokmusicmusic', 'tiktokmusicdl'],
  desc: 'Search and download tiktokmusic',
  category: 'music',
  execute: async (sock, msg, args) => {
      try {
         const query = args.join(' ');
         if (!query) return sock.sendMessage(msg.key.remoteJid, { text: 'Bruh, provide a title or link! 😂' }, { quoted: msg });

         await sock.sendMessage(msg.key.remoteJid, { text: '🎵 Searching... hang on!' }, { quoted: msg });

         let titleStr = 'Unknown';
         let artistStr = 'Unknown';
         let thumb = '';
         let url = '';

         if ('tiktokmusic' === 'lyrics') {
             try {
                 const res = await axios.get(`https://some-random-api.com/lyrics?title=${encodeURIComponent(query)}`, {timeout: 5000});
                 const botname = get('botname') || 'ULTIMATE-MD';
                 const box = createBox(botname, [
                    formatLine('sᴏɴɢ', String(res.data.title).substring(0, 20)),
                    formatLine('ᴀʀᴛɪsᴛ', String(res.data.author).substring(0, 20))
                 ]);
                 return sock.sendMessage(msg.key.remoteJid, { text: box + '\n\n' + res.data.lyrics }, { quoted: msg });
             } catch(e) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'Could not find lyrics for that!' }, { quoted: msg });
             }
         }

         try {
             const r = await yts(query);
             const videos = r.videos;
             if (videos.length === 0) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'No results found! 😭' }, { quoted: msg });
             }
             const v = videos[0];
             titleStr = v.title;
             artistStr = v.author.name;
             thumb = v.thumbnail;
             url = v.url;
         } catch(e) {
             return sock.sendMessage(msg.key.remoteJid, { text: 'Search failed, try again!' }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴏᴏʟ', 'TIKTOKMUSIC'),
            formatLine('ᴛɪᴛʟᴇ', String(titleStr).substring(0, 20)),
            formatLine('ᴀʀᴛɪsᴛ', String(artistStr).substring(0, 20)),
            formatLine('sᴏᴜʀᴄᴇ', 'YouTube')
         ]);

         let mediaUrl = '';
         try {
             const dlRes = await axios.get(`https://api.akuari.my.id/downloader/ytplay1?query=${encodeURIComponent(url)}`, {timeout: 5000});
             if (dlRes.data && dlRes.data.result && dlRes.data.result.url) {
                 mediaUrl = dlRes.data.result.url;
             }
         } catch(e) {}

         if ('tiktokmusic' === 'songsearch' || !mediaUrl) {
             await sock.sendMessage(msg.key.remoteJid, { image: { url: thumb }, caption: box }, { quoted: msg });
             if (!mediaUrl && 'tiktokmusic' !== 'songsearch') {
                  await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Failed to fetch download link, but here is the info!' }, { quoted: msg });
             }
         }

         if (mediaUrl) {
             if ('tiktokmusic' === 'ytmp4' || 'tiktokmusic' === 'ytvideo') {
                 await sock.sendMessage(msg.key.remoteJid, { video: { url: mediaUrl }, caption: box }, { quoted: msg });
             } else {
                 await sock.sendMessage(msg.key.remoteJid, { image: { url: thumb }, caption: box });
                 await sock.sendMessage(msg.key.remoteJid, { audio: { url: mediaUrl }, mimetype: 'audio/mp4' }, { quoted: msg });
             }
         }

      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Yikes, executing tiktokmusic went completely sideways 😂.' }, { quoted: msg });
      }
  }
};
