import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antidelete',
  alias: ['ad'],
  desc: 'ʀᴇᴄᴏᴠᴇʀ ᴅᴇʟᴇᴛᴇᴅ ᴍsɢs',
  category: 'automation',
  react: '🔄',
  execute: async (sock, msg, args) => {
    const sub = args[0]?.toLowerCase();
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    
    // Defaulting to true as requested
    let state = get('antidelete') || { public: true, groups: [], chats: [] };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'group') {
      if (!isGroup) return sock.sendMessage(jid, { text: 'Bruh you are not in a group' }, { quoted: msg });
      if (!state.groups.includes(jid)) state.groups.push(jid);
      res = 'ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ';
    } else if (sub === 'chat') {
      if (isGroup) return sock.sendMessage(jid, { text: 'Bruh this is a group' }, { quoted: msg });
      if (!state.chats.includes(jid)) state.chats.push(jid);
      res = 'ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ᴄʜᴀᴛ';
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      const cGrp = state.groups.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      const cCht = state.chats.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
        formatLine('ᴛʜɪs ɢʀᴏᴜᴘ', cGrp),
        formatLine('ᴛʜɪs ᴄʜᴀᴛ', cCht),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪᴅᴇʟᴇᴛᴇ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ɢʀᴏᴜᴘ, ᴄʜᴀᴛ, sᴛᴀᴛᴜs';
    }
    
    await set('antidelete', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪᴅᴇʟᴇᴛᴇ', bodyLines) }, { quoted: msg });
  }
};
