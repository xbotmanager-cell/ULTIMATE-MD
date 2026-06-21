import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'welcome',
  alias: ['wc'],
  desc: 'ɢʀᴇᴇᴛ ɴᴇᴡ ᴍᴇᴍʙᴇʀs',
  category: 'automation',
  react: '👋',
  execute: async (sock, msg, args) => {
    const sub = args[0]?.toLowerCase();
    const textArg = args.slice(1).join(' ');
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');
    
    let state = get('welcome') || { public: false, groups: [], text: 'Welcome @user to @group!' };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴡᴇʟᴄᴏᴍᴇ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴡᴇʟᴄᴏᴍᴇ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'group') {
      if (!isGroup) return sock.sendMessage(jid, { text: 'Bruh you are not in a group' }, { quoted: msg });
      if (!state.groups.includes(jid)) state.groups.push(jid);
      res = 'ᴡᴇʟᴄᴏᴍᴇ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ';
    } else if (sub === 'text') {
      if (textArg) {
         state.text = textArg;
         res = `ᴡᴇʟᴄᴏᴍᴇ ᴛᴇxᴛ sᴇᴛ ᴛᴏ:\n${textArg}`;
      } else {
         res = 'ᴘʀᴏᴠɪᴅᴇ ᴛᴇxᴛ ᴛᴇᴍᴘʟᴀᴛᴇ. ᴜsᴇ @user ᴀɴᴅ @group.';
      }
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      const cGrp = state.groups.includes(jid) ? 'ᴏɴ' : 'ᴏғғ';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
        formatLine('ᴛʜɪs ɢʀᴏᴜᴘ', cGrp),
        formatLine('ᴛᴇxᴛ', state.text.slice(0, 15) + '...'),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴡᴇʟᴄᴏᴍᴇ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ɢʀᴏᴜᴘ, ᴛᴇxᴛ <ᴛᴇᴍᴘʟᴀᴛᴇ>, sᴛᴀᴛᴜs';
    }
    
    await set('welcome', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴡᴇʟᴄᴏᴍᴇ', bodyLines) }, { quoted: msg });
  }
};
