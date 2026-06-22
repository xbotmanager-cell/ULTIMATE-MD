import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();

// Remove old fallback APIs logic
function fixMusic() {
    const dir = path.join(baseDir, 'commands', 'music');
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const cmd = file.replace('.js', '');
        
        let c = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import yts from 'yt-search';
import axios from 'axios';

export default {
  name: '${cmd}',
  alias: ['${cmd}music', '${cmd}dl'],
  desc: 'Search and download ${cmd}',
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

         if ('${cmd}' === 'lyrics') {
             try {
                 const res = await axios.get(\`https://some-random-api.com/lyrics?title=\${encodeURIComponent(query)}\`, {timeout: 5000});
                 const botname = get('botname') || 'ULTIMATE-MD';
                 const box = createBox(botname, [
                    formatLine('sᴏɴɢ', String(res.data.title).substring(0, 20)),
                    formatLine('ᴀʀᴛɪsᴛ', String(res.data.author).substring(0, 20))
                 ]);
                 return sock.sendMessage(msg.key.remoteJid, { text: box + '\\n\\n' + res.data.lyrics }, { quoted: msg });
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
            formatLine('ᴛᴏᴏʟ', '${cmd.toUpperCase()}'),
            formatLine('ᴛɪᴛʟᴇ', String(titleStr).substring(0, 20)),
            formatLine('ᴀʀᴛɪsᴛ', String(artistStr).substring(0, 20)),
            formatLine('sᴏᴜʀᴄᴇ', 'YouTube')
         ]);

         let mediaUrl = '';
         try {
             const dlRes = await axios.get(\`https://api.akuari.my.id/downloader/ytplay1?query=\${encodeURIComponent(url)}\`, {timeout: 5000});
             if (dlRes.data && dlRes.data.result && dlRes.data.result.url) {
                 mediaUrl = dlRes.data.result.url;
             }
         } catch(e) {}

         if ('${cmd}' === 'songsearch' || !mediaUrl) {
             await sock.sendMessage(msg.key.remoteJid, { image: { url: thumb }, caption: box }, { quoted: msg });
             if (!mediaUrl && '${cmd}' !== 'songsearch') {
                  await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Failed to fetch download link, but here is the info!' }, { quoted: msg });
             }
         }

         if (mediaUrl) {
             if ('${cmd}' === 'ytmp4' || '${cmd}' === 'ytvideo') {
                 await sock.sendMessage(msg.key.remoteJid, { video: { url: mediaUrl }, caption: box }, { quoted: msg });
             } else {
                 await sock.sendMessage(msg.key.remoteJid, { image: { url: thumb }, caption: box });
                 await sock.sendMessage(msg.key.remoteJid, { audio: { url: mediaUrl }, mimetype: 'audio/mp4' }, { quoted: msg });
             }
         }

      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Yikes, executing ${cmd} went completely sideways 😂.' }, { quoted: msg });
      }
  }
};
`;
        fs.writeFileSync(path.join(dir, file), c);
    }
}

function fixSearch() {
    const dir = path.join(baseDir, 'commands', 'search');
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const cmd = file.replace('.js', '');
        let c = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: '${cmd}',
  alias: ['${cmd}search'],
  desc: 'Search for ${cmd} with thumbnails and details',
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

         if ('${cmd}' === 'movie') {
             try {
                 const res = await axios.get(\`https://www.omdbapi.com/?t=\${encodeURIComponent(query)}&apikey=df43905c\`);
                 if (res.data && res.data.Response === 'True') {
                     picUrl = res.data.Poster !== 'N/A' ? res.data.Poster : '';
                     titleStr = res.data.Title;
                     descStr = res.data.Plot;
                     extraStr = res.data.Actors;
                 } else {
                     return sock.sendMessage(msg.key.remoteJid, { text: 'Movie not found! 😭' }, { quoted: msg });
                 }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Movie API error!' }, { quoted: msg }); }
         } else if ('${cmd}' === 'anime' || '${cmd}' === 'manga') {
             try {
                const res = await axios.get(\`https://api.jikan.moe/v4/${cmd}?q=\${encodeURIComponent(query)}&limit=1\`);
                if (res.data && res.data.data && res.data.data.length > 0) {
                    const d = res.data.data[0];
                    picUrl = d.images?.jpg?.image_url || '';
                    titleStr = d.title || 'Unknown';
                    descStr = d.synopsis || 'No synopsis';
                    extraStr = d.score ? \`Score: \${d.score}\` : 'No score';
                } else {
                     return sock.sendMessage(msg.key.remoteJid, { text: '${cmd} not found! 😭' }, { quoted: msg });
                }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: '${cmd} API error!' }, { quoted: msg }); }
         } else if ('${cmd}' === 'wikipedia') {
             try {
                 const res = await axios.get(\`https://en.wikipedia.org/api/rest_v1/page/summary/\${encodeURIComponent(query)}\`);
                 if (res.data) {
                     picUrl = res.data.thumbnail?.source || '';
                     titleStr = res.data.title;
                     descStr = res.data.extract;
                 }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Wiki article not found! 😭' }, { quoted: msg }); }
         } else if ('${cmd}' === 'githubsearch') {
             try {
                 const res = await axios.get(\`https://api.github.com/search/repositories?q=\${encodeURIComponent(query)}&per_page=1\`);
                 if (res.data?.items?.length > 0) {
                     const repo = res.data.items[0];
                     picUrl = repo.owner.avatar_url;
                     titleStr = repo.full_name;
                     descStr = repo.description;
                     extraStr = \`⭐ \${repo.stargazers_count}\`;
                 } else { return sock.sendMessage(msg.key.remoteJid, { text: 'Repo not found! 😭' }, { quoted: msg }); }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Github API error!' }, { quoted: msg }); }
         } else if ('${cmd}' === 'weather') {
             try {
                 const res = await axios.get(\`https://api.openweathermap.org/data/2.5/weather?q=\${encodeURIComponent(query)}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273\`);
                 if (res.data) {
                     titleStr = res.data.name;
                     descStr = res.data.weather[0]?.description;
                     extraStr = \`Temp: \${res.data.main?.temp}°C\`;
                 }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Weather not found! 😭' }, { quoted: msg }); }
         } else {
             titleStr = query;
             descStr = "Search not implemented for this domain yet.";
             picUrl = '';
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('sᴇᴀʀᴄʜ', '${cmd.toUpperCase()}'),
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
         await sock.sendMessage(msg.key.remoteJid, { text: 'My searching glasses are broken, couldn\\'t find it 🤓.' }, { quoted: msg });
      }
  }
};
`;
        fs.writeFileSync(path.join(dir, file), c);
    }
}

fixMusic();
fixSearch();
console.log('Fixed music and search APIs!');
