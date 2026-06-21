import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antiviewonce',
  alias: ['avo'],
  desc: 'sᴀᴠᴇ ᴠɪᴇᴡ ᴏɴᴄᴇ ᴍᴇᴅɪᴀ',
  category: 'automation',
  react: '👁️',
  execute: async (sock, msg, args) => {
    const sub = args[0]?.toLowerCase();
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    
    let state = get('antiviewonce') || { public: false, groups: [], chats: [] };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴀɴᴛɪᴠɪᴇᴡᴏɴᴄᴇ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴀɴᴛɪᴠɪᴇᴡᴏɴᴄᴇ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'group') {
      if (!isGroup) return sock.sendMessage(jid, { text: 'Bruh you are not in a group' }, { quoted: msg });
      if (!state.groups.includes(jid)) state.groups.push(jid);
      res = 'ᴀɴᴛɪᴠɪᴇᴡᴏɴᴄᴇ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ';
    } else if (sub === 'chat') {
      if (isGroup) return sock.sendMessage(jid, { text: 'Bruh this is a group' }, { quoted: msg });
      if (!state.chats.includes(jid)) state.chats.push(jid);
      res = 'ᴀɴᴛɪᴠɪᴇᴡᴏɴᴄᴇ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ᴄʜᴀᴛ';
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      const cGrp = state.groups.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      const cCht = state.chats.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
        formatLine('ᴛʜɪs ɢʀᴏᴜᴘ', cGrp),
        formatLine('ᴛʜɪs ᴄʜᴀᴛ', cCht),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪᴠɪᴇᴡᴏɴᴄᴇ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ɢʀᴏᴜᴘ, ᴄʜᴀᴛ, sᴛᴀᴛᴜs';
    }
    
    await set('antiviewonce', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪᴠɪᴇᴡᴏɴᴄᴇ', bodyLines) }, { quoted: msg });
  }
};
