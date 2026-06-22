import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const animeDir = path.join(baseDir, 'commands', 'anime');
const memeDir = path.join(baseDir, 'commands', 'animememe');
const stickerDir = path.join(baseDir, 'commands', 'animesticker');

[animeDir, memeDir, stickerDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const animeCommands = [
  'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 
  'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 
  'wave', 'highfive', 'handhold', 'nom', 'bite', 'glare', 'slap', 'kill', 
  'kick', 'happy', 'wink', 'poke', 'dance', 'cringe', 'naruto', 'sasuke', 
  'sakura', 'kakashi', 'hinata', 'itachi', 'goku', 'vegeta', 'gohan', 
  'piccolo', 'luffy', 'zoro', 'sanji', 'usopp', 'nami', 'chopper', 'robin', 
  'brook', 'franky'
];

const funStatements = [
  "Wow, so kawaii!",
  "Notice me senpai~",
  "Power level over 9000!",
  "Ara ara~",
  "Dattebayo!",
  "I will be the Pirate King!",
  "Omae wa mou shindeiru.",
  "Nani?!",
  "Sugoi dekai!",
  "Baka!",
  "Sasuga anime power!"
];

animeCommands.forEach(cmd => {
  // ANIME IMAGE COMMAND
  let contentImg = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: '${cmd}',
  alias: ['${cmd}pic', '${cmd}img'],
  desc: 'Pulls a ${cmd} image from multiple APIs.',
  category: 'anime',
  react: '🌸',
  execute: async (sock, msg, args) => {
    try {
      const apiSources = [
        { url: \`https://api.waifu.pics/sfw/${cmd}\`, path: 'url' },
        { url: \`https://nekos.best/api/v2/${cmd}\`, path: 'results.0.url' },
        { url: \`https://api.waifu.im/search?included_tags=${cmd}\`, path: 'images.0.url' },
        { url: \`https://nekos.life/api/v2/img/${cmd}\`, path: 'url' },
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
      
      const funMsg = "${funStatements[Math.floor(Math.random() * funStatements.length)]}";
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
`;
  fs.writeFileSync(path.join(animeDir, `${cmd}.js`), contentImg);

  // ANIME MEME COMMAND
  let contentMeme = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: '${cmd}meme',
  alias: ['${cmd}m', 'meme${cmd}'],
  desc: 'Fresh premium ${cmd} meme from APIs!',
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
      
      const funMsg = "${funStatements[Math.floor(Math.random() * funStatements.length)]}";
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
`;
  fs.writeFileSync(path.join(memeDir, `${cmd}meme.js`), contentMeme);

  // ANIME STICKER COMMAND
  let contentSticker = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: '${cmd}sticker',
  alias: ['${cmd}s', 'stc${cmd}'],
  desc: 'Pulls a ${cmd} sticker for chat domination!',
  category: 'animesticker',
  react: '🌟',
  execute: async (sock, msg, args) => {
    try {
      const apiSources = [
        { url: \`https://api.waifu.pics/sfw/${cmd}\`, path: 'url' },
        { url: \`https://nekos.best/api/v2/${cmd}\`, path: 'results.0.url' },
        { url: \`https://api.waifu.im/search?included_tags=${cmd}\`, path: 'images.0.url' },
        { url: \`https://nekos.life/api/v2/img/${cmd}\`, path: 'url' },
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
        caption: \`\${botname} | ${cmd.toUpperCase()} STICKER 🌟\\n(\${usedApi})\`
      }, { quoted: msg });
      
    } catch (err) { }
  }
};
`;
  fs.writeFileSync(path.join(stickerDir, `${cmd}sticker.js`), contentSticker);
});

console.log('Successfully generated 50 Anime, 50 Anime Meme, and 50 Anime Sticker commands!');
