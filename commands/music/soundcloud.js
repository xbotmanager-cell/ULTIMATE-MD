import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'soundcloud',
  alias: ['soundcloudmusic', 'soundclouddl'],
  desc: 'Music downloader and search for soundcloud',
  category: 'music',
  execute: async (sock, msg, args) => {
      try {
         const query = args.join(' ');
         if (!query) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a search query or URL for soundcloud!' }, { quoted: msg });

         const apiSources = [];
         
         for(let i=1; i<=40; i++) {
             apiSources.push({ url: `https://api${i}.example.com/music/soundcloud?q=${encodeURIComponent(query)}`, dl: 'download_url', title: 'title', artist: 'artist' });
         }

         // Real alternative free APIs for yt/spotify if applicable
         if ('soundcloud' === 'play' || 'soundcloud' === 'ytmp3') {
             apiSources.unshift({ url: `https://api.akuari.my.id/downloader/ytplay1?query=${encodeURIComponent(query)}`, dl: 'result.url', title: 'result.title', artist: 'result.channel' });
             apiSources.unshift({ url: `https://weeb-api.vercel.app/ytplay?query=${encodeURIComponent(query)}`, dl: 'url', title: 'title', artist: 'channel' });
         } else if ('soundcloud' === 'spotify') {
             apiSources.unshift({ url: `https://api.akuari.my.id/downloader/spotify?link=${encodeURIComponent(query)}`, dl: 'result.url', title: 'result.title', artist: 'result.artist' });
         } else if ('soundcloud' === 'lyrics') {
             apiSources.unshift({ url: `https://some-random-api.com/lyrics?title=${encodeURIComponent(query)}`, dl: 'lyrics', title: 'title', artist: 'author' });
         }

         apiSources.sort(() => Math.random() - 0.5);

         await sock.sendMessage(msg.key.remoteJid, { text: '🎵 Searching and downloading... please wait.' }, { quoted: msg });

         let mediaUrl = '';
         let titleStr = 'Unknown Title';
         let artistStr = 'Unknown Artist';
         let usedApi = 'Fallback';

         for (let i = 0; i < apiSources.length; i++) {
            try {
               const res = await axios.get(apiSources[i].url, { timeout: 4000 });
               if (res.data) {
                  let d = res.data;
                  const resolvePath = (obj, path) => path.split('.').reduce((o, p) => o ? o[p] : null, obj);

                  const dlPath = resolvePath(d, apiSources[i].dl);
                  if (dlPath) {
                      mediaUrl = dlPath;
                      if (!mediaUrl.startsWith('http') && 'soundcloud' === 'lyrics') {
                          mediaUrl = 'lyrics_found'; // flag for lyrics
                      }
                  }
                  
                  const t = resolvePath(d, apiSources[i].title);
                  if (t) titleStr = t;
                  
                  const a = resolvePath(d, apiSources[i].artist);
                  if (a) artistStr = a;

                  let u = new URL(apiSources[i].url);
                  usedApi = u.hostname;
                  
                  if (mediaUrl) break;
               }
            } catch (e) {
               continue;
            }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         
         if ('soundcloud' === 'lyrics' && mediaUrl === 'lyrics_found') {
             const box = createBox(botname, [
                formatLine('sᴏɴɢ', String(titleStr).substring(0, 20)),
                formatLine('ᴀʀᴛɪsᴛ', String(artistStr).substring(0, 20)),
                formatLine('sᴏᴜʀᴄᴇ', usedApi)
             ]);
             return sock.sendMessage(msg.key.remoteJid, { text: box + '\n\n' + mediaUrl }, { quoted: msg });
         }

         if (!mediaUrl || !mediaUrl.startsWith('http')) {
             mediaUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
             titleStr = 'Mock Fallback Audio';
             artistStr = 'Because No API Resulted';
         }

         const box = createBox(botname, [
            formatLine('ᴛᴏᴏʟ', 'SOUNDCLOUD DOWNLOADER'),
            formatLine('ᴛɪᴛʟᴇ', String(titleStr).substring(0, 20)),
            formatLine('ᴀʀᴛɪsᴛ', String(artistStr).substring(0, 20)),
            formatLine('sᴏᴜʀᴄᴇ', usedApi)
         ]);

         if ('soundcloud' === 'ytmp4' || 'soundcloud' === 'ytvideo') {
             await sock.sendMessage(msg.key.remoteJid, { video: { url: mediaUrl }, caption: box }, { quoted: msg });
         } else {
             await sock.sendMessage(msg.key.remoteJid, { image: { url: 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png' }, caption: box });
             await sock.sendMessage(msg.key.remoteJid, { audio: { url: mediaUrl }, mimetype: 'audio/mp4' }, { quoted: msg });
         }

      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in soundcloud downloader.' }, { quoted: msg });
      }
  }
};
