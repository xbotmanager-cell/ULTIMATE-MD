import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();

function fixStalkerAndMedia() {
    // STALKER
    let dir = path.join(baseDir, 'commands', 'stalker');
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const cmd = file.replace('.js', '');
            let c = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: '${cmd}',
  alias: ['stalk${cmd.replace('stalk','')}'],
  desc: 'Stalk profile for ${cmd.replace('stalk','')}',
  category: 'stalker',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid username to stalk!' }, { quoted: msg });

          await sock.sendMessage(msg.key.remoteJid, { text: '🕵️ Fetching profile details...' }, { quoted: msg });

         const target = '${cmd}' === 'githubstalk' ? 'github' : '${cmd.replace('stalk','')}';

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followersData = '0';

         if (target === 'github') {
             try {
                const res = await axios.get(\`https://api.github.com/users/\${encodeURIComponent(username)}\`);
                if (res.data) {
                    picUrl = res.data.avatar_url;
                    fullName = res.data.name || res.data.login;
                    bioData = res.data.bio || 'No bio';
                    followersData = res.data.followers;
                }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'User not found on GitHub! 😭' }, { quoted: msg }); }
         } else if (target === 'npm') {
             try {
                const res = await axios.get(\`https://registry.npmjs.org/\${encodeURIComponent(username)}\`);
                if (res.data) {
                    fullName = res.data.name;
                    bioData = res.data.description;
                    picUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg';
                }
             } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'Package not found on NPM! 😭' }, { quoted: msg }); }
         } else {
             // Let's just output that privacy mode is on instead of lying
             return sock.sendMessage(msg.key.remoteJid, { text: \`Privacy mode on for \${target}, or API is down! Cannot stalk \${username} rn.\` }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', target.toUpperCase()),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', String(fullName).substring(0, 20)),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followersData)),
            formatLine('ʙɪᴏ', String(bioData).substring(0, 25))
         ]);

         if (picUrl) {
             await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl }, caption: box }, { quoted: msg });
         } else {
             await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};`;
            fs.writeFileSync(path.join(dir, file), c);
        }
    }

    // MEDIA
    dir = path.join(baseDir, 'commands', 'media');
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const cmd = file.replace('.js', '');
            let c = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: '${cmd}',
  alias: ['${cmd}dl', '${cmd}down'],
  desc: 'Download media from ${cmd.toUpperCase()}',
  category: 'media',
  execute: async (sock, msg, args) => {
      try {
         let url = args.join(' ');
         if (!url && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
             url = msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
         } else if (!url && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text) {
             url = msg.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text;
         }

         if (!url) return sock.sendMessage(msg.key.remoteJid, { text: 'Bruh, provide a valid ${cmd} link or reply to one!' }, { quoted: msg });
         
         const urlRegex = /(https?:\\/\\/[^\\s]+)/g;
         const urls = url.match(urlRegex);
         if (!urls) return sock.sendMessage(msg.key.remoteJid, { text: 'I couldn\\'t find a valid link in that! 🤡' }, { quoted: msg });
         url = urls[0];

         await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Fetching ${cmd} media... hang tight.' }, { quoted: msg });

         let finalUrl = '';
         let captionText = 'Downloaded via ULTIMATE-MD';
         
         if ('${cmd}' === 'tiktok') {
            try {
               const res = await axios.get(\`https://www.tikwm.com/api/?url=\${encodeURIComponent(url)}\`);
               if (res.data?.data?.play) {
                   finalUrl = res.data.data.play;
                   captionText = res.data.data.title || captionText;
               } else { throw new Error('Not found'); }
            } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: 'TikTok download failed! No video found or API down. 😭' }, { quoted: msg }); }
         } else if ('${cmd}' === 'instagram' || '${cmd}' === 'facebook' || '${cmd}' === 'twitter') {
            try {
               const res = await axios.get(\`https://api.akuari.my.id/downloader/\${'${cmd}' === 'instagram' ? 'igdl' : '${cmd}'}?link=\${encodeURIComponent(url)}\`);
               if (res.data?.result?.url || res.data?.url?.[0]?.url) {
                   finalUrl = res.data.result?.url || res.data.url[0].url;
               } else { throw new Error('Not found'); }
            } catch(e) { return sock.sendMessage(msg.key.remoteJid, { text: '${cmd.toUpperCase()} download failed! Try another link. 😭' }, { quoted: msg }); }
         } else {
             return sock.sendMessage(msg.key.remoteJid, { text: 'Downloading from ${cmd.toUpperCase()} is temporarily unavailable!' }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴏᴏʟ', '${cmd.toUpperCase()} DOWNLOADER'),
            formatLine('ᴅᴇᴛᴀɪʟ', captionText.substring(0, 30) + '...')
         ]);

         if (finalUrl.includes('.mp4') || finalUrl.startsWith('https://')) {
             await sock.sendMessage(msg.key.remoteJid, { video: { url: finalUrl }, caption: box }, { quoted: msg });
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Downloading ${cmd} just crashed my tiny server brain 😭.' }, { quoted: msg });
      }
  }
};`;
            fs.writeFileSync(path.join(dir, file), c);
        }
    }
}

fixStalkerAndMedia();
console.log('Fixed stalker and media APIs!');
