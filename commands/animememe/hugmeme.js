import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'hugmeme',
  alias: ['hugm', 'memehug'],
  desc: 'Fresh premium hug meme from APIs!',
  category: 'animememe',
  react: '😂',
  execute: async (sock, msg, args) => {
    try {
      const apiSources = [
        { url: 'https://meme-api.com/gimme/animemes', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/goodanimemes', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/wholesomeanimemes', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/anime_irl', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/dankruto', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/BokuNoMetaAcademia', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/ShitPostCrusaders', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/MemePiece', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/animenocontext', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/Megumin', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/Komi_san', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/Genshin_Memepact', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/HonkaiStarRailMemes', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/pokemonmemes', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/Gundam', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/EvangelionMemes', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/FullmetalAlchemist', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/SteinsGateMemes', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/DemonSlayerAnime', path: 'url', tPath: 'title' },
        { url: 'https://meme-api.com/gimme/CodeGeass', path: 'url', tPath: 'title' }
      ];

      apiSources.sort(() => Math.random() - 0.5);

      let finalUrl = '';
      let memeTitle = 'Anime Meme';
      let usedApi = 'Fallback';
      
      for (let i = 0; i < apiSources.length; i++) {
         try {
            const res = await axios.get(apiSources[i].url, { timeout: 3000 });
            if (res.data && res.data[apiSources[i].path]) {
               finalUrl = res.data[apiSources[i].path];
               if (res.data[apiSources[i].tPath]) memeTitle = res.data[apiSources[i].tPath];
               let u = new URL(apiSources[i].url);
               usedApi = u.hostname;
               break;
            }
         } catch (e) {
            continue;
         }
      }

      if (!finalUrl) finalUrl = 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png';
      
      const funMsg = "Power level over 9000!";
      const botname = get('botname') || 'ULTIMATE-MD';
      const box = createBox(botname, [
         formatLine('ᴛɪᴛʟᴇ', memeTitle.substring(0, 20)),
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
