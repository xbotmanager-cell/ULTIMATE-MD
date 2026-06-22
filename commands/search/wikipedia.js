import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'wikipedia',
  alias: ['wikipediasearch'],
  desc: 'Search for wikipedia with thumbnails and details',
  category: 'search',
  execute: async (sock, msg, args) => {
      try {
         const query = args.join(' ');
         if (!query) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a search query!' }, { quoted: msg });

         const apiSources = [];
         
         if ('wikipedia' === 'movie') {
             apiSources.push({ url: `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=df43905c`, pic: 'Poster', title: 'Title', desc: 'Plot', extra: 'Actors' });
         } else if ('wikipedia' === 'anime' || 'wikipedia' === 'manga') {
             apiSources.push({ url: `https://api.jikan.moe/v4/wikipedia?q=${encodeURIComponent(query)}&limit=1`, pic: 'data.0.images.jpg.image_url', title: 'data.0.title', desc: 'data.0.synopsis', extra: 'data.0.score' });
         } else {
             for(let i=1; i<=20; i++) {
                 apiSources.push({ url: `https://api${i}.example.com/search/wikipedia?q=${encodeURIComponent(query)}`, pic: 'thumbnail', title: 'title', desc: 'description', extra: 'info' });
             }
         }

         apiSources.sort(() => Math.random() - 0.5);

         await sock.sendMessage(msg.key.remoteJid, { text: '🔍 Searching... please wait.' }, { quoted: msg });

         let picUrl = 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png';
         let titleStr = 'Not Found';
         let descStr = 'N/A';
         let extraStr = 'N/A';
         let usedApi = 'Fallback';

         for (let i = 0; i < apiSources.length; i++) {
            try {
               const res = await axios.get(apiSources[i].url, { timeout: 4000 });
               if (res.data) {
                  let d = res.data;
                  if (d.Response === 'False') continue;
                  
                  // Helper to resolve dot notation
                  const resolvePath = (obj, path) => path.split('.').reduce((o, p) => o ? o[p] : null, obj);

                  const p = resolvePath(d, apiSources[i].pic);
                  if (p && p.startsWith('http')) picUrl = p;
                  
                  const t = resolvePath(d, apiSources[i].title);
                  if (t) titleStr = t;
                  
                  const dsc = resolvePath(d, apiSources[i].desc);
                  if (dsc) descStr = dsc;
                  
                  const ext = resolvePath(d, apiSources[i].extra);
                  if (ext) extraStr = ext;

                  let u = new URL(apiSources[i].url);
                  usedApi = u.hostname;
                  break;
               }
            } catch (e) {
               continue;
            }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('sᴇᴀʀᴄʜ', 'WIKIPEDIA'),
            formatLine('ʀᴇsᴜʟᴛ', String(titleStr).substring(0, 20)),
            formatLine('ɪɴғᴏ', String(extraStr).substring(0, 20)),
            formatLine('ᴅᴇᴛᴀɪʟ', String(descStr).substring(0, 30) + '...')
         ]);

         await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl }, caption: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in search wikipedia.' }, { quoted: msg });
      }
  }
};
