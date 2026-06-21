import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import { modes } from '../../lib/modes.js';

export default {
  name: 'modestatus',
  alias: ['ms'],
  desc: 'sʜᴏᴡ ᴄᴜʀʀᴇɴᴛ ᴍᴏᴅᴇ',
  category: 'mode',
  react: '📊',
  execute: async (sock, msg, args) => {
    const currentMode = get('mode') || 'public';
    const desc = modes[currentMode]?.desc || 'Unknown';
    
    const bodyLines = [
      formatLine('ᴄᴜʀʀᴇɴᴛ', currentMode.toUpperCase()),
      formatLine('ɪɴғᴏ', desc)
    ];
    
    return sock.sendMessage(msg.key.remoteJid, { text: createBox('ᴍᴏᴅᴇ sᴛᴀᴛᴜs', bodyLines) }, { quoted: msg });
  }
};
