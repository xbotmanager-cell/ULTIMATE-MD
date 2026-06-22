import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'settings',
  desc: 'View all bot settings',
  category: 'settings',
  execute: async (sock, msg, args) => {
      const isOwner = msg.key.fromMe || msg.key.participant?.startsWith(get('owner') || sock.user.id.split(':')[0]) || msg.key.remoteJid?.startsWith(get('owner') || sock.user.id.split(':')[0]);
      if (!isOwner && 'settings' !== 'settings') return sock.sendMessage(msg.key.remoteJid, { text: 'Owner only command!' });
      
      const platform = process.env.RENDER ? 'Render' : process.env.HEROKU_APP_NAME ? 'Heroku' : process.env.RAILWAY_ENVIRONMENT ? 'Railway' : process.env.FLY_APP_NAME ? 'Fly.io' : process.env.PTERODACTYL ? 'Pterodactyl' : 'VPS/Local';
      const dbType = process.env.SUPABASE_URL ? 'Supabase' : process.env.MONGODB_URI ? 'MongoDB' : 'Local/Memory';
      const botname = get('botname') || 'ULTIMATE-MD';
      const owner = get('owner') || sock.user.id.split(':')[0];
      const prefix = get('prefix') || '$';
      const mode = get('mode') || 'public';
      
      const box = createBox(botname, [
         formatLine('ʙᴏᴛɴᴀᴍᴇ', botname),
         formatLine('ᴘʀᴇғɪx ', prefix),
         formatLine('ᴏᴡɴᴇʀ  ', typeof owner === 'string' ? owner.split('@')[0] : owner),
         formatLine('ᴍᴏᴅᴇ   ', mode.toUpperCase()),
         formatLine('ᴘʟᴀᴛғᴏʀᴍ', platform),
         formatLine('ᴅᴀᴛᴀʙᴀsᴇ', dbType)
      ]);
      await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
  
  }
};
