import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'antispam',
  alias: ['as'],
  desc: 'ʙʟᴏᴄᴋ sᴘᴀᴍ ᴍᴇssᴀɢᴇs',
  category: 'automation',
  react: '🛡️',
  execute: async (sock, msg, args) => {
    const sub = args[0]?.toLowerCase();
    const val = args[1]?.toLowerCase();
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    
    let state = get('antispam') || { public: false, groups: [], chats: [], limit: 5, action: 'delete' };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴀɴᴛɪsᴘᴀᴍ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴀɴᴛɪsᴘᴀᴍ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'group') {
      if (!isGroup) return sock.sendMessage(jid, { text: 'Bruh you are not in a group' }, { quoted: msg });
      if (!state.groups.includes(jid)) state.groups.push(jid);
      res = 'ᴀɴᴛɪsᴘᴀᴍ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ';
    } else if (sub === 'chat') {
      if (isGroup) return sock.sendMessage(jid, { text: 'Bruh this is a group' }, { quoted: msg });
      if (!state.chats.includes(jid)) state.chats.push(jid);
      res = 'ᴀɴᴛɪsᴘᴀᴍ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ᴄʜᴀᴛ';
    } else if (sub === 'limit') {
      if (val && !isNaN(val)) {
         state.limit = parseInt(val);
         res = `ᴀɴᴛɪsᴘᴀᴍ ʟɪᴍɪᴛ sᴇᴛ ᴛᴏ ${state.limit} (ᴘᴇʀ 10s)`;
      } else {
         res = `ᴘʀᴏᴠɪᴅᴇ ᴀ ɴᴜᴍʙᴇʀ ғᴏʀ ᴛʜᴇ ʟɪᴍɪᴛ.`;
      }
    } else if (sub === 'action' && ['delete', 'kick'].includes(val)) {
      state.action = val;
      res = `ᴀɴᴛɪsᴘᴀᴍ ᴀᴄᴛɪᴏɴ sᴇᴛ ᴛᴏ ${val.toUpperCase()}`;
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      const cGrp = state.groups.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      const cCht = state.chats.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
        formatLine('ᴛʜɪs ɢʀᴏᴜᴘ', cGrp),
        formatLine('ᴛʜɪs ᴄʜᴀᴛ', cCht),
        formatLine('ʟɪᴍɪᴛ', `${state.limit} msgs/10s`),
        formatLine('ᴀᴄᴛɪᴏɴ', (state.action || 'delete').toUpperCase()),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪsᴘᴀᴍ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ɢʀᴏᴜᴘ, ᴄʜᴀᴛ, ʟɪᴍɪᴛ <ɴ>, ᴀᴄᴛɪᴏɴ <ᴅᴇʟᴇᴛᴇ/ᴋɪᴄᴋ>, sᴛᴀᴛᴜs';
    }
    
    await set('antispam', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴀɴᴛɪsᴘᴀᴍ', bodyLines) }, { quoted: msg });
  }
};
