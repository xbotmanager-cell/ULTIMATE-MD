import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'country',
  alias: ['countrysearch'],
  desc: 'Search for country with thumbnails and details',
  category: 'search',
  execute: async (sock, msg, args) => {
      try {
         const query = args.join(' ');
         if (!query) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a search query!' }, { quoted: msg });

         await sock.sendMessage(msg.key.remoteJid, { text: '🔍 Searching... please wait.' }, { quoted: msg });

         let picUrl = '';
         let titleStr = 'Not Found';
         let descStr = 'N/A';
         let extraStr = 'N/A';

         if ('country' === 'movie') {
             try {
                 const res = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=df43905c`);
                 if (res.data && res.data.Response === 'True') {
                     picUrl = res.data.Poster !== 'N/A' ? res.data.Poster : '';
                     titleStr = res.data.Title;
                     descStr = res.data.Plot;
                     extraStr = res.data.Actors;
                 } else {
                     return sock.sendMessage(msg.key.remoteJid, { text: 'Movie not found! 😭' }, { quoted: msg });
                 }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Movie API error!' }, { quoted: msg }); }
         } else if ('country' === 'anime' || 'country' === 'manga') {
             try {
                const res = await axios.get(`https://api.jikan.moe/v4/country?q=${encodeURIComponent(query)}&limit=1`);
                if (res.data && res.data.data && res.data.data.length > 0) {
                    const d = res.data.data[0];
                    picUrl = d.images?.jpg?.image_url || '';
                    titleStr = d.title || 'Unknown';
                    descStr = d.synopsis || 'No synopsis';
                    extraStr = d.score ? `Score: ${d.score}` : 'No score';
                } else {
                     return sock.sendMessage(msg.key.remoteJid, { text: 'country not found! 😭' }, { quoted: msg });
                }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'country API error!' }, { quoted: msg }); }
         } else if ('country' === 'wikipedia') {
             try {
                 const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                 if (res.data) {
                     picUrl = res.data.thumbnail?.source || '';
                     titleStr = res.data.title;
                     descStr = res.data.extract;
                 }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Wiki article not found! 😭' }, { quoted: msg }); }
         } else if ('country' === 'githubsearch') {
             try {
                 const res = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=1`);
                 if (res.data?.items?.length > 0) {
                     const repo = res.data.items[0];
                     picUrl = repo.owner.avatar_url;
                     titleStr = repo.full_name;
                     descStr = repo.description;
                     extraStr = `⭐ ${repo.stargazers_count}`;
                 } else { return sock.sendMessage(msg.key.remoteJid, { text: 'Repo not found! 😭' }, { quoted: msg }); }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Github API error!' }, { quoted: msg }); }
         } else if ('country' === 'weather') {
             try {
                 const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`);
                 if (res.data) {
                     titleStr = res.data.name;
                     descStr = res.data.weather[0]?.description;
                     extraStr = `Temp: ${res.data.main?.temp}°C`;
                 }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Weather not found! 😭' }, { quoted: msg }); }
         } else {
             titleStr = query;
             descStr = "Search not implemented for this domain yet.";
             picUrl = '';
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('sᴇᴀʀᴄʜ', 'COUNTRY'),
            formatLine('ʀᴇsᴜʟᴛ', String(titleStr).substring(0, 20)),
            formatLine('ɪɴғᴏ', String(extraStr).substring(0, 20)),
            formatLine('ᴅᴇᴛᴀɪʟ', String(descStr).substring(0, 40) + '...')
         ]);

         if (picUrl) {
             await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl }, caption: box }, { quoted: msg });
         } else {
             await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'My searching glasses are broken, couldn\'t find it 🤓.' }, { quoted: msg });
      }
  }
};
