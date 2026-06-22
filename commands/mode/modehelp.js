import { createBox, formatLine } from '../../system/box.js';
import { modes } from '../../lib/modes.js';

export default {
  name: 'modehelp',
  alias: ['mh'],
  desc: 'ᴇxᴘʟᴀɪɴ ᴀʟ ᴍᴏᴅᴇs',
  category: 'mode',
  react: '❓',
  execute: async (sock, msg, args) => {
    let text = '📌 *ᴀᴠᴀɪʟᴀʙʟᴇ ᴍᴏᴅᴇs:*\n\n';
    for (const [modeName, modeObj] of Object.entries(modes)) {
       text += `🏷️ *${modeName.toUpperCase()}*\n📝 ${modeObj.desc}\n\n`;
    }
    return sock.sendMessage(msg.key.remoteJid, { text: text.trim() }, { quoted: msg });
  }
};
