import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'antilink',
  alias: ['al'],
  desc: 'ᴅᴇʟᴇᴛᴇ ʟɪɴᴋs ᴀᴜᴛᴏ',
  category: 'automation',
  react: '🔗',
  execute: async (sock, msg, args) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const ownerCheck = isOwner(sock, msg, sender);
    const groupMetadata = msg.key.remoteJid.endsWith('@g.us') ? await sock.groupMetadata(msg.key.remoteJid).catch(() => null) : null;
    const admins = groupMetadata ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];
    const realIsAdmin = admins.includes(sender) || ownerCheck;
    if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'You need admin or owner rights to use automation controls!' }, { quoted: msg });
    const sub = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    
    let state = get('antilink') || { public: false, groups: [], chats: [], action: 'delete' };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴀɴᴛɪʟɪɴᴋ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴀɴᴛɪʟɪɴᴋ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'group') {
      if (!isGroup) return sock.sendMessage(jid, { text: 'Bruh you are not in a group' }, { quoted: msg });
      if (!state.groups.includes(jid)) state.groups.push(jid);
      res = 'ᴀɴᴛɪʟɪɴᴋ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ';
    } else if (sub === 'chat') {
      if (isGroup) return sock.sendMessage(jid, { text: 'Bruh this is a group' }, { quoted: msg });
      if (!state.chats.includes(jid)) state.chats.push(jid);
      res = 'ᴀɴᴛɪʟɪɴᴋ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ᴄʜᴀᴛ';
    } else if (sub === 'warn' || sub === 'kick' || sub === 'delete') {
      state.action = sub;
      res = `ᴀɴᴛɪʟɪɴᴋ ᴀᴄᴛɪᴏɴ sᴇᴛ ᴛᴏ ${sub.toUpperCase()}`;
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      const cGrp = state.groups.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      const cCht = state.chats.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      const dAct = state.action || 'delete';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
        formatLine('ᴛʜɪs ɢʀᴏᴜᴘ', cGrp),
        formatLine('ᴛʜɪs ᴄʜᴀᴛ', cCht),
        formatLine('ᴀᴄᴛɪᴏɴ', dAct.toUpperCase()),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪʟɪɴᴋ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ɢʀᴏᴜᴘ, ᴄʜᴀᴛ, ᴡᴀʀɴ, ᴋɪᴄᴋ, sᴛᴀᴛᴜs';
    }
    
    await set('antilink', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪʟɪɴᴋ', bodyLines) }, { quoted: msg });
  }
};
