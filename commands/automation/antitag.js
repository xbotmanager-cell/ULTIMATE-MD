import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'antitag',
  alias: ['at'],
  desc: 'ʙʟᴏᴄᴋ ᴍᴀss ᴛᴀɢs',
  category: 'automation',
  react: '🏷️',
  execute: async (sock, msg, args) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const ownerCheck = isOwner(sock, msg, sender);
    const groupMetadata = msg.key.remoteJid.endsWith('@g.us') ? await sock.groupMetadata(msg.key.remoteJid).catch(() => null) : null;
    const admins = groupMetadata ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];
    const realIsAdmin = admins.includes(sender) || ownerCheck;
    if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'You need admin or owner rights to use automation controls!' }, { quoted: msg });
    const sub = args[0]?.toLowerCase();
    const val = args[1];
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    
    let state = get('antitag') || { public: false, groups: [], chats: [], max: 10 };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴀɴᴛɪᴛᴀɢ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴀɴᴛɪᴛᴀɢ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'group') {
      if (!isGroup) return sock.sendMessage(jid, { text: 'Bruh you are not in a group' }, { quoted: msg });
      if (!state.groups.includes(jid)) state.groups.push(jid);
      res = 'ᴀɴᴛɪᴛᴀɢ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ';
    } else if (sub === 'chat') {
      return sock.sendMessage(jid, { text: 'Bruh antitag only works in groups!' }, { quoted: msg });
    } else if (sub === 'max') {
      if (val && !isNaN(val)) {
        state.max = parseInt(val);
        res = `ᴀɴᴛɪᴛᴀɢ ᴍᴀx ᴍᴇɴᴛɪᴏɴs sᴇᴛ ᴛᴏ ${state.max}`;
      } else {
        res = `ᴘʀᴏᴠɪᴅᴇ ᴀ ɴᴜᴍʙᴇʀ ғᴏʀ ᴛʜᴇ ᴍᴀx ᴍᴇɴᴛɪᴏɴs.`;
      }
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      const cGrp = state.groups.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
        formatLine('ᴛʜɪs ɢʀᴏᴜᴘ', cGrp),
        formatLine('ᴍᴀx ᴍᴇɴᴛɪᴏɴs', `${state.max}`),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪᴛᴀɢ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ɢʀᴏᴜᴘ, ᴍᴀx <ɴ>, sᴛᴀᴛᴜs';
    }
    
    await set('antitag', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪᴛᴀɢ', bodyLines) }, { quoted: msg });
  }
};
