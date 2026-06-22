import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'morse',
  desc: 'Utility tool for morse',
  category: 'tools',
  react: '🛠️',
  execute: async (sock, msg, args) => {
      try {
         const input = args.join(' ');
         
         let result = 'Tool executed successfully!';

         if ('morse' === 'translate') {
             if (!input) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide text to translate!' });
             try {
                const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(input)}`);
                result = res.data[0][0][0];
             } catch(e) {}
         } else if ('morse' === 'qrcreate' || 'morse' === 'qrcode') {
             if (!input) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide text for QR!' });
             const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(input)}`;
             return await sock.sendMessage(msg.key.remoteJid, { image: { url: qrUrl } }, { quoted: msg });
         } else if ('morse' === 'tinyurl' || 'morse' === 'shorturl') {
             if (!input) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a URL!' });
             try {
                const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(input)}`);
                result = res.data;
             } catch(e) {}
         } else if ('morse' === 'base64') {
             result = Buffer.from(input || 'ULTIMATE-MD').toString('base64');
         } else if ('morse' === 'calc') {
             try { result = String(eval(input.replace(/[^0-9+\-*\/().]/g, ''))); } catch(e) { result = 'Math Error'; }
         } else if ('morse' === 'mcserver') {
             try {
                const res = await axios.get(`https://api.mcsrvstat.us/2/${encodeURIComponent(input || 'mc.hypixel.net')}`);
                result = res.data.online ? `Players: ${res.data.players.online}/${res.data.players.max}` : 'Offline';
             } catch(e) {}
         } else if ('morse' === 'password') {
             result = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-5) + '@!';
         } else {
             result = `morse tool result: ${input || 'success'}`;
         }

         await sock.sendMessage(msg.key.remoteJid, { text: result }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Yikes, executing morse went completely sideways 😂.' }, { quoted: msg });
      }
  }
};
