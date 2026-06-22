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
                 throw new Error('Not found');
             }
         } catch(e) { 
             try {
                 const res = await axios.get(\`https://bk9.fun/stalk/tiktok?q=\${encodeURIComponent(username)}\`, axiosConfig);
                 if (res.data?.status && res.data?.BK9) {
                     const data = res.data.BK9;
                     picUrl = data.avatar || '';
                     fullName = data.nickname || username;
                     bioData = data.signature || 'No bio';
                     followers = data.followerCount || '0';
                     following = data.followingCount || '0';
                     likes = data.heartCount || '0';
                     videos = data.videoCount || '0';
                     friends = data.friendCount || '0';
                 } else {
                     return sock.sendMessage(msg.key.remoteJid, { text: 'TikTok user not found or API is down! 😭' }, { quoted: msg });
                 }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'TikTok APIs are heavily restricted down, couldn\\'t stalk!' }, { quoted: msg });
             }
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

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = '0';
         let following = '0';
         let posts = '0';

         ${axiosConfig}
         try {
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
                 const res = await axios.get(\`https://bk9.fun/stalk/instagram?q=\${encodeURIComponent(username)}\`, axiosConfig);
                 if (res.data?.BK9) {
                     picUrl = res.data.BK9.profile_pic_url || '';
                     fullName = res.data.BK9.full_name || username;
                     bioData = res.data.BK9.biography || 'No bio';
                     followers = res.data.BK9.edge_followed_by?.count || '0';
                     following = res.data.BK9.edge_follow?.count || '0';
                     posts = res.data.BK9.edge_owner_to_timeline_media?.count || '0';
                 } else {
                     return sock.sendMessage(msg.key.remoteJid, { text: 'IG user not found! 😭' }, { quoted: msg });
                 }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'IG APIs down, couldn\\'t stalk!' }, { quoted: msg });
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
             try {
                 const res = await axios.get(\`https://bk9.fun/stalk/github?q=\${encodeURIComponent(username)}\`);
                 if(res.data?.BK9) {
                     picUrl = res.data.BK9.avatar_url;
                     fullName = res.data.BK9.name || res.data.BK9.login;
                     bioData = res.data.BK9.bio || 'No bio';
                     followers = res.data.BK9.followers;
                     following = res.data.BK9.following;
                     repos = res.data.BK9.public_repos;
                     company = res.data.BK9.company || 'None';
                 } else { throw new Error('Not found') }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'GitHub API down, couldn\\'t stalk!' }, { quoted: msg });
             }
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
             try{
                 const res = await axios.get(\`https://bk9.fun/stalk/npm?q=\${encodeURIComponent(pkg)}\`);
                 if(res.data?.BK9) {
                     fullName = res.data.BK9.name;
                     bioData = res.data.BK9.description || 'No description';
                     version = res.data.BK9.version || 'N/A';
                     license = res.data.BK9.license || 'N/A';
                     author = res.data.BK9.author || 'Unknown';
                 } else throw new Error();
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'NPM API down, couldn\\'t stalk!' }, { quoted: msg });
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
             return sock.sendMessage(msg.key.remoteJid, { text: \`Twitter API down. Direct link: x.com/\${username}\` }, { quoted: msg });
         }

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
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};`,

 redditstalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'redditstalk',
  alias: ['stalkreddit'],
  desc: 'Stalk a Reddit profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '').replace('u/', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Reddit username!' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let karma = '0';
         let created = 'N/A';

         ${axiosConfig}
         try {
             // Reddit doesn't require auth for basic public user lookup via /about.json
             const res = await axios.get(\`https://www.reddit.com/user/\${encodeURIComponent(username)}/about.json\`, axiosConfig);
             if (res.data?.data) {
                 const data = res.data.data;
                 picUrl = data.icon_img?.split('?')[0] || data.snoovatar_img || '';
                 fullName = data.name || username;
                 bioData = data.subreddit?.public_description || 'No bio';
                 karma = data.total_karma;
                 created = new Date(data.created_utc * 1000).toDateString();
             } else {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'Reddit user not found! 😭' }, { quoted: msg });
             }
         } catch(e) {
             return sock.sendMessage(msg.key.remoteJid, { text: \`Reddit API down. Direct link: reddit.com/user/\${username}\` }, { quoted: msg });
         }

         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'REDDIT'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ᴋᴀʀᴍᴀ', String(karma)),
            formatLine('ᴄʀᴇᴀᴛᴇᴅ', String(created)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', \`reddit.com/user/\${username}\`)
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

 telegramstalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'telegramstalk',
  alias: ['stalktelegram', 'tgstalk'],
  desc: 'Stalk a Telegram profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Telegram username!' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'TELEGRAM'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('sᴛᴀᴛᴜs', 'API restricts direct stalking.'),
            formatLine('ʟɪɴᴋ', \`t.me/\${username}\`)
         ]);
         
         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};`,

 pintereststalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'pintereststalk',
  alias: ['stalkpinterest', 'pinstalk'],
  desc: 'Stalk a Pinterest profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Pinterest username!' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let followers = 'N/A';
         let following = 'N/A';

         ${axiosConfig}
         try {
             const res = await axios.get(\`https://api.popcat.xyz/pinterest?user=\${encodeURIComponent(username)}\`, axiosConfig);
             if (res.data?.full_name) {
                 picUrl = res.data.profile_pic || '';
                 fullName = res.data.full_name || username;
                 bioData = res.data.biography || 'No bio';
                 followers = res.data.followers;
                 following = res.data.following;
             } else {
                 throw new Error('Not found');
             }
         } catch(e) { 
             try {
                 const res = await axios.get(\`https://bk9.fun/stalk/pinterest?q=\${encodeURIComponent(username)}\`);
                 if(res.data?.BK9) {
                     picUrl = res.data.BK9.profile_image_url || '';
                     fullName = res.data.BK9.full_name || username;
                     bioData = res.data.BK9.about || 'No bio';
                     followers = res.data.BK9.follower_count || 'Private';
                     following = res.data.BK9.following_count || 'Private';
                 } else { throw new Error('Not found') }
             } catch(err) {
                 return sock.sendMessage(msg.key.remoteJid, { text: \`Pinterest API down. Direct link: pinterest.com/\${username}\` }, { quoted: msg });
             }
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'PINTEREST'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ғᴏʟʟᴏᴡᴇʀs', String(followers)),
            formatLine('ғᴏʟʟᴏᴡɪɴɢ', String(following)),
            formatLine('ʙɪᴏ', String(bioData)),
            formatLine('ʟɪɴᴋ', \`pinterest.com/\${username}\`)
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

 robloxstalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import axios from 'axios';

export default {
  name: 'robloxstalk',
  alias: ['stalkroblox', 'rbxstalk'],
  desc: 'Stalk a Roblox profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Roblox username!' }, { quoted: msg });

         let picUrl = '';
         let fullName = 'N/A';
         let bioData = 'N/A';
         let created = 'N/A';
         let isBanned = 'False';

         ${axiosConfig}
         try {
             // Use Roblox search API for UID then data API
             const searchRes = await axios.get(\`https://users.roblox.com/v1/users/search?keyword=\${encodeURIComponent(username)}&limit=10\`, axiosConfig);
             if (searchRes.data?.data?.length > 0) {
                 const uid = searchRes.data.data[0].id;
                 const userRes = await axios.get(\`https://users.roblox.com/v1/users/\${uid}\`, axiosConfig);
                 if (userRes.data) {
                     fullName = userRes.data.displayName || userRes.data.name;
                     bioData = userRes.data.description || 'No description';
                     created = new Date(userRes.data.created).toDateString();
                     isBanned = userRes.data.isBanned ? 'True' : 'False';
                     
                     // Get Thumbnail
                     try {
                         const thumbRes = await axios.get(\`https://thumbnails.roblox.com/v1/users/avatar?userIds=\${uid}&size=720x720&format=Png&isCircular=false\`, axiosConfig);
                         picUrl = thumbRes.data?.data?.[0]?.imageUrl || '';
                     } catch(err){}
                 }
             } else {
                 return sock.sendMessage(msg.key.remoteJid, { text: 'Roblox user not found! 😭' }, { quoted: msg });
             }
         } catch(e) {
             return sock.sendMessage(msg.key.remoteJid, { text: \`Roblox API down. Direct link: roblox.com/users\` }, { quoted: msg });
         }

         const botname = get('botname') || 'ULTIMATE-MD';
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'ROBLOX'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('ɴᴀᴍᴇ', fullName),
            formatLine('ᴄʀᴇᴀᴛᴇᴅ', String(created)),
            formatLine('ʙᴀɴɴᴇᴅ', String(isBanned)),
            formatLine('ʙɪᴏ', String(bioData).substring(0, 50)),
            formatLine('ʟɪɴᴋ', \`roblox.com/search/users?keyword=\${username}\`)
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

 snapchatstalk: `import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'snapchatstalk',
  alias: ['stalksnapchat', 'snapstalk'],
  desc: 'Stalk a Snapchat profile',
  category: 'stalker',
  react: '🕵️',
  execute: async (sock, msg, args) => {
      try {
         const username = args.join('').replace('@', '');
         if (!username) return sock.sendMessage(msg.key.remoteJid, { text: 'Provide a valid Snapchat username!' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         
         const box = createBox(botname, [
            formatLine('ᴛᴀʀɢᴇᴛ', 'SNAPCHAT'),
            formatLine('ᴜsᴇʀɴᴀᴍᴇ', username),
            formatLine('sᴛᴀᴛᴜs', 'API access generally unavailable'),
            formatLine('ʟɪɴᴋ', \`snapchat.com/add/\${username}\`)
         ]);
         
         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Whoops, stealth mode broke, I dropped my binoculars! 🤦‍♂️' }, { quoted: msg });
      }
  }
};`
};

for (const [key, value] of Object.entries(stalkers)) {
    fs.writeFileSync(path.join(stalkDir, key + '.js'), value);
}

console.log('Successfully generated robust stalkers V3');
