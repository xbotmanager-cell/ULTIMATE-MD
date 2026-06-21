import { createBox, formatLine } from '../../system/box.js';
import { listSudo } from '../../lib/sudo.js';

export default {
  name: 'listsudo',
  alias: ['lsudo'],
  desc: 'ʟɪsᴛ ᴀʟʟ sᴜᴅᴏs',
  category: 'sudo',
  react: '📋',
  execute: async (sock, msg, args) => {
    const data = listSudo();
    const sudos = data.sudos;
    const bans = data.bans;
    
    let activeLines = sudos.map(s => formatLine('ᴜsᴇʀ', `@${s.split('@')[0]}`));
    if (activeLines.length === 0) activeLines = [formatLine('sᴛᴀᴛᴜs', 'ɴᴏ ᴀᴄᴛɪᴠᴇ sᴜᴅᴏs')];
    
    let banLines = [];
    for (const [jid, info] of Object.entries(bans)) {
       const msLeft = info.expire - Date.now();
       const hLeft = Math.max(0, Math.floor(msLeft / 3600000));
       banLines.push(formatLine(`@${jid.split('@')[0]}`, `${hLeft}ʜ ʟᴇғᴛ`));
    }
    if (banLines.length === 0) banLines = [formatLine('sᴛᴀᴛᴜs', 'ɴᴏ ʙᴀɴɴᴇᴅ sᴜᴅᴏs')];
    
    const activeText = createBox('ᴀᴄᴛɪᴠᴇ sᴜᴅᴏs', activeLines);
    const bannedText = createBox('ʙᴀɴɴᴇᴅ sᴜᴅᴏs', banLines);
    
    const mentions = [...sudos, ...Object.keys(bans)];
    
    return sock.sendMessage(msg.key.remoteJid, { text: `${activeText}\n\n${bannedText}`, mentions }, { quoted: msg });
  }
};
