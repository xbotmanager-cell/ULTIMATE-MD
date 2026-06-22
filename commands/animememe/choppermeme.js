import { createBox, formatLine } from '../../system/box.js';
import axios from 'axios';

export default {
  name: 'choppermeme',
  alias: ['chopperm', 'memechopper'],
  desc: 'Fresh premium chopper dank memes. Straight from Reddit!',
  category: 'animememe',
  react: '😂',
  execute: async (sock, msg, args) => {
    try {
      const urls = [
      'https://i.imgur.com/kHcmO3o.jpg',
      'https://i.imgur.com/8QzXkM1.jpg',
      'https://i.imgur.com/xO43E08.jpg',
      'https://i.imgur.com/HnI2uOh.jpg',
      'https://i.imgur.com/nJgY57w.jpg',
      'https://i.imgur.com/xT5rR9X.jpg',
      'https://i.imgur.com/L78S1Z0.jpg',
      'https://i.imgur.com/6S3O11w.jpg',
      'https://i.imgur.com/mO2X9vY.jpg',
      'https://i.imgur.com/Qh1Q217.jpg',
      'https://i.imgur.com/vHqJ9Z9.jpg',
      'https://i.imgur.com/lH6Z4U8.jpg',
      'https://i.imgur.com/hY6W0C8.jpg',
      'https://i.imgur.com/kI3L2N5.jpg',
      'https://i.imgur.com/pQ1J8W7.jpg',
      'https://i.imgur.com/oK8M0Z4.jpg',
      'https://i.imgur.com/uR5T3P2.jpg',
      'https://i.imgur.com/yE4A5Q9.jpg',
      'https://i.imgur.com/iP7S1V6.jpg',
      'https://i.imgur.com/fL5E8R3.jpg',
      'https://i.imgur.com/dS2W0Q9.jpg',
      'https://i.imgur.com/aC6Q2R1.jpg',
      'https://i.imgur.com/1vYIeU9.jpg',
      'https://i.imgur.com/5lG2o5M.jpg',
      'https://i.imgur.com/7KqP3Xo.jpg',
      'https://i.imgur.com/9vM7e8H.jpg',
      'https://i.imgur.com/mPqS2n4.jpg',
      'https://i.imgur.com/bQ9xT2c.jpg',
      'https://i.imgur.com/rN5vL3K.jpg',
      'https://i.imgur.com/pZ8vR9E.jpg',
      'https://i.imgur.com/kM3wN2H.jpg',
      'https://i.imgur.com/vT6rX9L.jpg',
      'https://i.imgur.com/cX5qB8J.jpg',
      'https://i.imgur.com/nP2mK4F.jpg',
      'https://i.imgur.com/gR7vT1D.jpg',
      'https://i.imgur.com/lD3pM6B.jpg',
      'https://i.imgur.com/yK9qM2G.jpg',
      'https://i.imgur.com/fN1vL8C.jpg',
      'https://i.imgur.com/hV5wN9P.jpg',
      'https://i.imgur.com/tR4mB3L.jpg',
      'https://i.imgur.com/eQ8qM2J.jpg',
      'https://i.imgur.com/aP1mX7K.jpg',
      'https://i.imgur.com/wV2N5B9.jpg',
      'https://i.imgur.com/mK4vP9L.jpg',
      'https://i.imgur.com/qR8vD3M.jpg',
      'https://i.imgur.com/xK2mP7D.jpg',
      'https://i.imgur.com/vM9qP4K.jpg',
      'https://i.imgur.com/pL5wB2D.jpg',
      'https://i.imgur.com/tR2vK9M.jpg',
      'https://i.imgur.com/mN1P8K4.jpg',
      'https://i.imgur.com/lK6P2m9.jpg',
      'https://i.imgur.com/wR4D7mP.jpg',
      'https://i.imgur.com/vP1K9mL.jpg',
      'https://i.imgur.com/bK3P8mD.jpg',
      'https://i.imgur.com/zW9X1Qv.png'
      ];
      
      let finalUrl = urls[Math.floor(Math.random() * urls.length)];
      let usedApi = false;
      let memeTitle = "Spicy Anime Meme";
      
      try {
         const res = await axios.get('https://meme-api.com/gimme/animemes');
         if (res.data && res.data.url) {
            finalUrl = res.data.url;
            memeTitle = res.data.title || memeTitle;
            usedApi = true;
         }
      } catch (e) { } // Fallback
      
      const funMsg = "Nani?!";
      const box = createBox('CHOPPER MEME', [
         formatLine('ᴛɪᴛʟᴇ', memeTitle.substring(0, 25)),
         formatLine('sᴏᴜʀᴄᴇ', usedApi ? 'Reddit API' : 'SwiftBot Fallback DB'),
         formatLine('ғᴜɴ', funMsg)
      ]);
      
      await sock.sendMessage(msg.key.remoteJid, { 
        image: { url: finalUrl },
        caption: box 
      }, { quoted: msg });
      
    } catch (err) { }
  }
};
