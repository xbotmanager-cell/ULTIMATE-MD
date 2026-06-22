import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const stalkDir = path.join(baseDir, 'commands', 'stalker');

if (!fs.existsSync(stalkDir)) fs.mkdirSync(stalkDir, { recursive: true });

const axiosConfig = `const axiosConfig = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } };`;

const stalkers = {
  tiktokstalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'tiktokstalk',
  alias: ['stalktiktok', 'ttstalk', 'tiktokprofile'],
  desc: 'Stalk a TikTok profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid TikTok username!' }, { quoted: msg });

         await sock.sendMessage(msg.key.remoteJid, { text: '🕵️ Fetching TikTok profile details...' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = '0';
         let following = '0';
         let likes = '0';
         let videos = '0';
         let friends = '0';

         ${axiosConfig}
         try {
             const res = await axios.get(\`https://www.tikwm.com/api/user/info?unique_id=\${encodeURIComponent(username)}\`, axiosConfig);
             if (res.data && res.data.data && res.data.data.user) {
                 const data = res.data.data;
                 picUrl = data.user.avatarLarger || data.user.avatarMedium || data.user.avatarThumb || '';
                 fullName = data.user.nickname || username;
                 bioData = data.user.signature || 'No bio';
                 followers = data.stats.followerCount || '0';
                 following = data.stats.followingCount || '0';
                 likes = data.stats.heartCount || '0';
                 videos = data.stats.videoCount || '0';
                 friends = data.stats.friendCount || '0';
             } else {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'TikTok user not found or API is down! 😭' }, { quoted: msg });
             }
         } catch(e) { 
             return sock.sendMessage(msg.key.remoteJid, { text: 'TikTok API down, couldn\\'t stalk!' }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'TIKTOK'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴɪᴄᴋɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ʟɪᴋᴇs', String(likes)),
            formatLine('ᴠɪᴅᴇᴏs', String(videos)),
            formatLine('ғʀɪᴇɴᴅs', String(friends)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', \`tiktok.com/@\${username}\`)
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
};`,

  igstalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'igstalk',
  alias: ['stalkig', 'instagramstalk'],
  desc: 'Stalk an Instagram profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid IG username!' }, { quoted: msg });

         await sock.sendMessage(msg.key.remoteJid, { text: '🕵️ Fetching IG profile details...' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = '0';
         let following = '0';
         let posts = '0';

         ${axiosConfig}
         try {
             // Try Popcat API
             const res = await axios.get(\`https://api.popcat.xyz/instagram?user=\${encodeURIComponent(username)}\`, axiosConfig);
             if (res.data && res.data.full_name) {
                 picUrl = res.data.profile_pic;
                 fullName = res.data.full_name;
                 bioData = res.data.biography || 'No bio';
                 followers = res.data.followers;
                 following = res.data.following;
                 posts = res.data.posts;
             } else {
                 throw new Error('Not found');
             }
         } catch(e) { 
             try {
                const res = await axios.get(\`https://api.akuari.my.id/search/igstalk?query=\${encodeURIComponent(username)}\`);
                if (res.data?.result) {
                    const data = res.data.result;
                    picUrl = data.Profile_pic || '';
                    fullName = data.Full_name || username;
                    bioData = data.Biography || 'No bio';
                    followers = data.Followers || '0';
                    following = data.Following || '0';
                    posts = data.Posts || '0';
                } else {
                    return sock.sendMessage(msg.key.remoteJid, { text: 'User not found! 😭' }, { quoted: msg });
                }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'IG API down, couldn\\'t stalk!' }, { quoted: msg });
             }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'INSTAGRAM'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ᴘᴏsᴛs', String(posts)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', \`instagram.com/\${username}\`)
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
};`,

  githubstalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'githubstalk',
  alias: ['stalkgithub', 'ghstalk'],
  desc: 'Stalk a GitHub profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid GitHub username!' }, { quoted: msg });

         await sock.sendMessage(msg.key.remoteJid, { text: '🕵️ Fetching GitHub profile details...' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = '0';
         let following = '0';
         let repos = '0';
         let company = 'N/A';

         ${axiosConfig}
         try {
             const res = await axios.get(\`https://api.github.com/users/\${encodeURIComponent(username)}\`, axiosConfig);
             if (res.data && res.data.login) {
                 picUrl = res.data.avatar_url;
                 fullName = res.data.name || res.data.login;
                 bioData = res.data.bio || 'No bio';
                 followers = res.data.followers;
                 following = res.data.following;
                 repos = res.data.public_repos;
                 company = res.data.company || 'None';
             } else {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'User not found! 😭' }, { quoted: msg });
             }
         } catch(e) { 
             return sock.sendMessage(msg.key.remoteJid, { text: 'GitHub API down, couldn\\'t stalk!' }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'GITHUB'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ʀᴇᴘᴏs', String(repos)),
            formatLine('ᴄᴏᴍᴘᴀɴʏ', String(company)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', \`github.com/\${username}\`)
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
};`,

  npmstalk: `import { createBox, formatLine } from '../../system/box.js';
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

         await sock.sendMessage(msg.key.remoteJid, { text: '🕵️ Fetching NPM package details...' }, { quoted: msg });

         let picUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let version = '0';
         let license = 'N/A';
         let author = 'N/A';

         ${axiosConfig}
         try {
             const res = await axios.get(\`https://registry.npmjs.org/\${encodeURIComponent(pkg)}\`, axiosConfig);
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
             return sock.sendMessage(msg.key.remoteJid, { text: 'NPM API down, couldn\\'t stalk!' }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'NPM PACKAGE'),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ᴠᴇʀsɪᴏɴ', String(version)),
            formatLine('ʟɪᴄᴇɴsᴇ', String(license)),
            formatLine('ᴀᴜᴛʜᴏʀ', String(author)),
            formatLine('ᴅᴇsᴄʀɪᴘᴛɪᴏɴ', String(bioData)),
            formatLine('ʟɪɴᴋ', \`npmjs.com/package/\${pkg}\`)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl }, caption: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};`,

  twitterstalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'twitterstalk',
  alias: ['stalktwitter', 'xstalk'],
  desc: 'Stalk a Twitter/X profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Twitter username!' }, { quoted: msg });

         await sock.sendMessage(msg.key.remoteJid, { text: '🕵️ Fetching Twitter/X details...' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = 'N/A';
         let following = 'N/A';

         ${axiosConfig}
         try {
             const res = await axios.get(\`https://bk9.fun/stalk/twitter?q=\${encodeURIComponent(username)}\`, axiosConfig);
             if (res.data?.status && res.data?.BK9) {
                 const data = res.data.BK9;
                 picUrl = data.profile_image_url || '';
                 fullName = data.name || username;
                 bioData = data.description || 'No bio';
                 followers = data.public_metrics?.followers_count || 'Private/Unknown';
                 following = data.public_metrics?.following_count || 'Private/Unknown';
             } else {
                 throw new Error('Not found');
             }
         } catch(e) {
             try {
                // Secondary fallback using a free API or just outputting manual generic link
                return sock.sendMessage(msg.key.remoteJid, { text: \`Twitter API is heavily restricted. Here is the direct link: x.com/\${username}\` }, { quoted: msg });
             } catch(err) {}
         }

         if (fullName !== 'N/A') {
             const box = createBox(botname, [
                formatLine('ᴛᴀʀɢᴇᴛ', 'TWITTER/X'),
                formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
                formatLine('ɴᴀᴍᴇ', fullName),
                formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
                formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
                formatLine('ʙɪᴏ', String(bioData)),
                formatLine('ʟɪɴᴋ', \`x.com/\${username}\`)
             ]);

             if (picUrl) {
                 await sock.sendMessage(msg.key.remoteJid, { image: { url: picUrl.replace('_normal', '') }, caption: box }, { quoted: msg });
             } else {
                 await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
             }
         }
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};`
};

const defaultStalker = `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'PLATFORMstalk',
  alias: ['stalkPLATFORM', 'PLATFORMprofile'],
  desc: 'Stalk a PLATFORM profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid username!' }, { quoted: msg });

         await sock.sendMessage(msg.key.remoteJid, { text: '🕵️ Fetching PLATFORM details...' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         
         // Generic fallback for platforms without public free APIs
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'PLATFORM'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', 'Private/Hidden'),
            formatLine('sᴛᴀᴛᴜs', 'API access restricted for PLATFORM'),
            formatLine('ʟɪɴᴋ', \`PLATFORM_URL/\${username}\`)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};`;

for (const [key, value] of Object.entries(stalkers)) {
    fs.writeFileSync(path.join(stalkDir, key + '.js'), value);
}

const others = [
    { cmd: 'telegramstalk', platform: 'Telegram', url: 't.me' },
    { cmd: 'pintereststalk', platform: 'Pinterest', url: 'pinterest.com' },
    { cmd: 'robloxstalk', platform: 'Roblox', url: 'roblox.com/users' },
    { cmd: 'redditstalk', platform: 'Reddit', url: 'reddit.com/user' },
    { cmd: 'snapchatstalk', platform: 'Snapchat', url: 'snapchat.com/add' },
];

others.forEach(item => {
    const code = defaultStalker
        .replace(/PLATFORMstalk/g, item.cmd)
        .replace(/PLATFORM_URL/g, item.url)
        .replace(/PLATFORM/g, item.platform);
    fs.writeFileSync(path.join(stalkDir, item.cmd + '.js'), code);
});

console.log('Successfully generated robust stalkers');
