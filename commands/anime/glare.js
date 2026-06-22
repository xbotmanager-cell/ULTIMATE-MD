import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'glare',
  alias: ['glarepic', 'glareimg'],
  desc: 'Pulls a glare image from multiple APIs.',
  category: 'anime',
  react: '🌸',
  execute: async (sock, msg, args) => {
    try {
      const apiSources = [
        { url: `https://api.waifu.pics/sfw/glare`, path: 'url' },
        { url: `https://nekos.best/api/v2/glare`, path: 'results.0.url' },
        { url: `https://api.waifu.im/search?included_tags=glare`, path: 'images.0.url' },
        { url: `https://nekos.life/api/v2/img/glare`, path: 'url' },
        { url: 'https://api.catboys.com/img', path: 'url' },
        { url: 'https://pic.re/image', path: 'url' },
        { url: 'https://meme-api.com/gimme/animemes', path: 'url' },
        { url: 'https://randomfox.ca/floof/', path: 'image' },
        { url: 'https://dog.ceo/api/breeds/image/random', path: 'message' },
        { url: 'https://api.thecatapi.com/v1/images/search', path: '0.url' },
        { url: 'https://api.waifu.pics/sfw/neko', path: 'url' },
        { url: 'https://nekos.best/api/v2/neko', path: 'results.0.url' },
        { url: 'https://api.waifu.im/search?included_tags=maid', path: 'images.0.url' },
        { url: 'https://nekos.life/api/v2/img/neko', path: 'url' },
        { url: 'https://meme-api.com/gimme/wholesomeanimemes', path: 'url' },
        { url: 'https://api.waifu.pics/sfw/waifu', path: 'url' },
        { url: 'https://nekos.best/api/v2/waifu', path: 'results.0.url' },
        { url: 'https://api.waifu.im/search?included_tags=waifu', path: 'images.0.url' },
        { url: 'https://nekos.life/api/v2/img/waifu', path: 'url' },
        { url: 'https://meme-api.com/gimme/anime_irl', path: 'url' }
      ];

      // randomize priority
      apiSources.sort(() => Math.random() - 0.5);

      let finalUrl = '';
      let usedApi = 'Fallback';

      for (let i = 0; i < apiSources.length; i++) {
         try {
            const res = await axios.get(apiSources[i].url, { timeout: 3000 });
            if (res.data) {
               let val = res.data;
               const paths = apiSources[i].path.split('.');
               for (const p of paths) {
                  if (val) val = val[p];
               }
               if (val && typeof val === 'string' && val.startsWith('http')) {
                  finalUrl = val;
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
         // true absolute last resort fallback so command does not crash
         finalUrl = 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png';
      }
      
      const funMsg = "Omae wa mou shindeiru.";
      const botname = get('botname') || 'ULTIMATE-MD';
      const box = createBox(botname, [
         formatLine('sᴏᴜʀᴄᴇ', usedApi),
         formatLine('ғᴜɴ', funMsg)
      ]);
      
      await sock.sendMessage(msg.key.remoteJid, { 
        image: { url: finalUrl },
        caption: box 
      }, { quoted: msg });
      
    } catch (err) { }
  }
};
