import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'npmstalk',
  alias: ['stalknpm', 'npmpkg'],
  desc: 'Stalk an NPM package',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const pkg = args.join('').toLowerCase();
         if (!pkg) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid NPM package name!' }, { quoted: msg });

         let picUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let version = '0';
         let license = 'N/A';
         let author = 'N/A';

         const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };
         try {
             const res = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, axiosConfig);
             if (res.data && res.data.name) {
                 fullName = res.data.name;
                 bioData = res.data.description || 'No description';
                 const latest = res.data['dist-tags']?.latest;
                 version = latest || 'N/A';
                 license = res.data.license || res.data.versions?.[latest]?.license || 'N/A';
                 author = res.data.author?.name || 'Unknown';
             } else {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'Package not found! 😭' }, { quoted: msg });
             }
         } catch(e) { 
             try{
                 const res = await axios.get(`https://bk9.fun/stalk/npm?q=${encodeURIComponent(pkg)}`);
                 if(res.data?.BK9) {
                     fullName = res.data.BK9.name;
                     bioData = res.data.BK9.description || 'No description';
                     version = res.data.BK9.version || 'N/A';
                     license = res.data.BK9.license || 'N/A';
                     author = res.data.BK9.author || 'Unknown';
                 } else throw new Error();
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'NPM API down, couldn\'t stalk!' }, { quoted: msg });
             }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'NPM PACKAGE'),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ᴠᴇʀsɪᴏɴ', String(version)),
            formatLine('ʟɪᴄᴇɴsᴇ', String(license)),
            formatLine('ᴀᴜᴛʜᴏʀ', String(author)),
            formatLine('ᴅᴇsᴄʀɪᴘᴛɪᴏɴ', String(bioData)),
            formatLine('ʟɪɴᴋ', `npmjs.com/package/${pkg}`)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl }, caption: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};