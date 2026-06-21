import { createAliveBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import os from 'os';

export default {
  name: 'alive',
  alias: ['a'],
  desc: 'ᴄʜᴇᴄᴋ ʙᴏᴛ sᴛᴀᴛᴜs',
  category: 'general',
  react: '💚',
  execute: async (sock, msg, args) => {
    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return `${h}h ${m}m ${s}s`;
    };

    const uptime = formatTime(process.uptime());
    const memUsage = process.memoryUsage().rss / 1024 / 1024;
    const mode = get('mode') || 'public';
    const owner = get('owner') || '@you';
    const prefix = get('prefix') || '$';
    
    // Alive box expects no vertical lines at the start of each line
    // example format:
    // ╭─━━━━━━━━━━━━━━━━━─╮
    //    ᴜʟᴛɪᴍᴀᴛᴇ-ᴍᴅ     
    // ├─━━━━━━━━━━━━━━━━━─┤
    //   ᴘʀᴇғɪx ➤ $        
    //   ᴍᴏᴅᴇ   ➤ ᴘᴜʙʟɪᴄ   
    //   ᴏᴡɴᴇʀ  ➤ @ʏᴏᴜ     
    // ╰─━━━━━━━━━━━━━━━━━─╯
    const bodyLines = [
      formatLine('ᴘʀᴇғɪx', prefix),
      formatLine('ᴍᴏᴅᴇ  ', mode),
      formatLine('ᴏᴡɴᴇʀ ', owner),
      formatLine('ᴜᴘᴛɪᴍᴇ', uptime),
      formatLine('ʀᴀᴍ   ', `${memUsage.toFixed(2)} MB`)
    ];
    
    const boxMessage = createAliveBox(bodyLines);
    
    await sock.sendMessage(msg.key.remoteJid, { text: boxMessage }, { quoted: msg });
  }
};
