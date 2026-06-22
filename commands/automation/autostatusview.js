import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'autostatusview',
  alias: ['asv'],
  desc: 'ᴀᴜᴛᴏ ᴠɪᴇᴡ sᴛᴀᴛᴜs',
  category: 'automation',
  react: '👀',
  execute: async (sock, msg, args) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const ownerCheck = isOwner(sock, msg, sender);
    const groupMetadata = msg.key.remoteJid.endsWith('@g.us') ? await sock.groupMetadata(msg.key.remoteJid).catch(() => null) : null;
    const admins = groupMetadata ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];
    const realIsAdmin = admins.includes(sender) || ownerCheck;
    if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'You need admin or owner rights to use automation controls!' }, { quoted: msg });
    const sub = args[0]?.toLowerCase();
    const jid = msg.key.remoteJid;
    
    let state = get('autostatusview') || { public: false };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴀᴜᴛᴏ sᴛᴀᴛᴜs ᴠɪᴇᴡ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴀᴜᴛᴏ sᴛᴀᴛᴜs ᴠɪᴇᴡ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴀᴜᴛᴏ sᴛᴀᴛᴜs ᴠɪᴇᴡ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, sᴛᴀᴛᴜs';
    }
    
    await set('autostatusview', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴀᴜᴛᴏ sᴛᴀᴛᴜs ᴠɪᴇᴡ', bodyLines) }, { quoted: msg });
  }
};
