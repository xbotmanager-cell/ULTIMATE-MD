import { createMenuBox, formatLine, createBox } from '../../system/box.js';
import { get } from '../../lib/db.js';

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
    const owner = get('owner') || '@you';
    
    // Group commands by category
    const categories = {};
    for (const cmd of global.commands) {
      if (!cmd.category) continue;
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd.name);
    }
    
    let menuText = createBox(botname, [
      formatLine('ᴘʀᴇғɪx', prefix),
      formatLine('ᴍᴏᴅᴇ  ', mode),
      formatLine('ᴏᴡɴᴇʀ ', owner)
    ]) + '\n\n';
    
    for (const cat in categories) {
      menuText += createMenuBox(cat, categories[cat]) + '\n\n';
    }
    
    await sock.sendMessage(msg.key.remoteJid, { text: menuText.trim() }, { quoted: msg });
  }
};
