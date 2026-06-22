import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'autoreact',
  alias: ['ar'],
  desc: 'ᴄᴏɴᴛʀᴏʟ ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ',
  category: 'automation',
  react: '💫',
  execute: async (sock, msg, args) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const ownerCheck = isOwner(sock, msg, sender);
    const groupMetadata = msg.key.remoteJid.endsWith('@g.us') ? await sock.groupMetadata(msg.key.remoteJid).catch(() => null) : null;
    const admins = groupMetadata ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];
    const realIsAdmin = admins.includes(sender) || ownerCheck;
    if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'You need admin or owner rights to use automation controls!' }, { quoted: msg });
    const sub = args[0]?.toLowerCase();
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    
    let state = get('autoreact') || { public: false, groups: [], chats: [] };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'group') {
      if (!isGroup) return sock.sendMessage(jid, { text: 'Bruh you are not in a group' }, { quoted: msg });
      if (!state.groups.includes(jid)) state.groups.push(jid);
      res = 'ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ';
    } else if (sub === 'chat') {
      if (isGroup) return sock.sendMessage(jid, { text: 'Bruh this is a group' }, { quoted: msg });
      if (!state.chats.includes(jid)) state.chats.push(jid);
      res = 'ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ᴄʜᴀᴛ';
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      const cGrp = state.groups.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      const cCht = state.chats.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
        formatLine('ᴛʜɪs ɢʀᴏᴜᴘ', cGrp),
        formatLine('ᴛʜɪs ᴄʜᴀᴛ', cCht),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ɢʀᴏᴜᴘ, ᴄʜᴀᴛ, sᴛᴀᴛᴜs';
    }
    
    await set('autoreact', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ', bodyLines) }, { quoted: msg });
  }
};
