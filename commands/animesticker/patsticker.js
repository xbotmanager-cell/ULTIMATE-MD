import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'patsticker',
  alias: ['pats', 'stcpat'],
  desc: 'Pulls a pat sticker for chat domination!',
  category: 'animesticker',
  react: '🌟',
  execute: async (sock, msg, args) => {
    try {
      const apiSources = [
        { url: `https://api.waifu.pics/sfw/pat`, path: 'url' },
        { url: `https://nekos.best/api/v2/pat`, path: 'results.0.url' },
        { url: `https://api.waifu.im/search?included_tags=pat`, path: 'images.0.url' },
        { url: `https://nekos.life/api/v2/img/pat`, path: 'url' },
        { url: 'https://api.catboys.com/img', path: 'url' },
        { url: 'https://pic.re/image', path: 'url' },
        { url: 'https://api.waifu.pics/sfw/dance', path: 'url' },
        { url: 'https://api.waifu.pics/sfw/cringe', path: 'url' },
        { url: 'https://api.waifu.pics/sfw/bite', path: 'url' },
        { url: 'https://nekos.best/api/v2/neko', path: 'results.0.url' },
        { url: 'https://api.waifu.pics/sfw/slap', path: 'url' },
        { url: 'https://nekos.best/api/v2/cuddle', path: 'results.0.url' },
        { url: 'https://nekos.best/api/v2/slap', path: 'results.0.url' },
        { url: 'https://nekos.best/api/v2/pat', path: 'results.0.url' },
        { url: 'https://nekos.best/api/v2/hug', path: 'results.0.url' },
        { url: 'https://nekos.best/api/v2/kiss', path: 'results.0.url' },
        { url: 'https://api.waifu.im/search?included_tags=maid', path: 'images.0.url' },
        { url: 'https://nekos.life/api/v2/img/smug', path: 'url' },
        { url: 'https://nekos.life/api/v2/img/baka', path: 'url' },
        { url: 'https://nekos.life/api/v2/img/tickle', path: 'url' }
      ];

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

      if (!finalUrl) finalUrl = 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png';
      
      const botname = get('botname') || 'ULTIMATE-MD';
      await sock.sendMessage(msg.key.remoteJid, { 
        image: { url: finalUrl },
        caption: `${botname} | PAT STICKER 🌟\n(${usedApi})`
      }, { quoted: msg });
      
    } catch (err) { }
  }
};
