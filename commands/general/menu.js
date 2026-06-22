import { createMenuBox, formatLine, createBox } from '../../system/box.js';
import { get } from '../../lib/db.js';
import os from 'os';
import process from 'process';

function getPlatform() {
  if (process.env.RENDER) return 'Render';
  if (process.env.HEROKU_APP_NAME) return 'Heroku';
  if (process.env.RAILWAY_ENVIRONMENT) return 'Railway';
  if (process.env.FLY_APP_NAME) return 'Fly.io';
  if (process.env.P_SERVER_ID || process.env.PTERODACTYL) return 'Pterodactyl / Katambag';
  if (process.env.KATAMBAG) return 'Katambag';
  return 'VPS / Local';
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  let res = '';
  if (d > 0) res += `${d}d `;
  if (h > 0) res += `${h}h `;
  if (m > 0) res += `${m}m `;
  res += `${s}s`;
  return res || '0s';
}

function generateRamBar(used, total) {
  const percent = Math.round((used / total) * 10);
  const filled = '█'.repeat(percent);
  const empty = '▒'.repeat(10 - percent);
  return `[${filled}${empty}] ${Math.round((used / total) * 100)}%`;
}

export default {
  name: 'menu',
  alias: ['help', 'list'],
  desc: 'sʜᴏᴡ ʙᴏᴛ ᴍᴇɴᴜ',
  category: 'general',
  react: '📜',
  execute: async (sock, msg, args) => {
    const prefix = get('prefix') || '$';
    const botname = get('botname') || 'ULTIMATE-MD';
    const mode = get('mode') || 'public';
    
    // Owner string from socket user
    const ownerId = sock.user.id.split(':')[0];
    const platform = getPlatform();
    const uptime = formatUptime(process.uptime());
    const dbType = process.env.SUPABASE_URL ? 'Supabase' : process.env.MONGODB_URI ? 'MongoDB' : 'Local/Memory';
    
    const usedRam = process.memoryUsage().rss;
    const totalRam = os.totalmem();
    const ramBar = generateRamBar(usedRam, totalRam);
    
    // Simulate ping speed
    const start = Date.now();
    await sock.sendPresenceUpdate('available', msg.key.remoteJid);
    const speed = Date.now() - start;

    // Group commands by category
    const categories = {};
    for (const cmd of global.commands) {
      if (!cmd.category) continue;
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd.name);
    }
    
    let menuText = createBox(botname, [
      formatLine('ᴏᴡɴᴇʀ ', ownerId),
      formatLine('ᴘʀᴇғɪx', prefix),
      formatLine('ᴍᴏᴅᴇ  ', mode.toUpperCase()),
      formatLine('ᴅᴀᴛᴀʙᴀsᴇ', dbType),
      formatLine('ᴘʟᴀᴛғᴏʀᴍ', platform),
      formatLine('ᴜᴘᴛɪᴍᴇ', uptime),
      formatLine('sᴘᴇᴇᴅ ', `${speed}ᴍs`),
      formatLine('ʀᴀᴍ   ', ramBar)
    ]) + '\n\n';
    
    for (const cat in categories) {
      menuText += createMenuBox(cat, categories[cat]) + '\n\n';
    }
    
    await sock.sendMessage(msg.key.remoteJid, { 
      image: { url: 'https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png' },
      caption: menuText.trim() 
    }, { quoted: msg });
  }
};
