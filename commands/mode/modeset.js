import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { modes } from '../../lib/modes.js';
import { isSudo } from '../../lib/sudo.js';

export default {
  name: 'modeset',
  alias: ['mode'],
  desc: 'ᴄʜᴀɴɢᴇ ʙᴏᴛ ᴍᴏᴅᴇ',
  category: 'mode',
  react: '⚙️',
  execute: async (sock, msg, args) => {
    const jid = msg.key.participant || msg.key.remoteJid;
    if (!msg.key.fromMe && !isSudo(jid)) return sock.sendMessage(msg.key.remoteJid, { text: 'Wow so ambitious, only owner can do this.' }, { quoted: msg });

    const newMode = args[0]?.toLowerCase();
    
    if (!newMode || !modes[newMode]) {
      return sock.sendMessage(msg.key.remoteJid, { text: 'Invalid mode! Check modehelp.' }, { quoted: msg });
    }
    
    await set('mode', newMode);
    
    const bodyLines = [
      formatLine('ᴍᴏᴅᴇ', newMode.toUpperCase()),
      formatLine('sᴛᴀᴛᴜs', 'ᴀᴄᴛɪᴠᴇ')
    ];
    return sock.sendMessage(msg.key.remoteJid, { text: createBox('ᴍᴏᴅᴇ ᴜᴘᴅᴀᴛᴇᴅ', bodyLines) }, { quoted: msg });
  }
};
