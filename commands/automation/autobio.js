import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'autobio',
  alias: ['ab'],
  desc: 'ᴀᴜᴛᴏ ᴜᴘᴅᴀᴛᴇ ʙɪᴏ',
  category: 'automation',
  react: '📝',
  execute: async (sock, msg, args) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const ownerCheck = isOwner(sock, msg, sender);
    const groupMetadata = msg.key.remoteJid.endsWith('@g.us') ? await sock.groupMetadata(msg.key.remoteJid).catch(() => null) : null;
    const admins = groupMetadata ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];
    const realIsAdmin = admins.includes(sender) || ownerCheck;
    if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'You need admin or owner rights to use automation controls!' }, { quoted: msg });
    const sub = args[0]?.toLowerCase();
    const textArg = args.slice(1).join(' ');
    const jid = msg.key.remoteJid;
    
    let state = get('autobio') || { public: false, text: 'ULTIMATE-MD | Time: {time}' };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ᴀᴜᴛᴏ ʙɪᴏ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ᴀᴜᴛᴏ ʙɪᴏ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'text') {
      if (textArg) {
         state.text = textArg;
         res = `ᴀᴜᴛᴏ ʙɪᴏ ᴛᴇxᴛ sᴇᴛ ᴛᴏ:\n${textArg}`;
      } else {
         res = 'ᴘʀᴏᴠɪᴅᴇ ᴛᴇxᴛ ᴛᴇᴍᴘʟᴀᴛᴇ. ᴜsᴇ {time} ᴀɴᴅ {date}.';
      }
    } else if (sub === 'status') {
      const gbl = state.public ? 'ᴏɴ' : 'ᴏғғ';
      
      const bodyLines = [
        formatLine('ɢʟᴏʙᴀʟ', gbl),
        formatLine('ᴛᴇxᴛ', state.text.slice(0, 15) + '...'),
      ];
      return sock.sendMessage(jid, { text: createBox('ᴀᴜᴛᴏ ʙɪᴏ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ᴛᴇxᴛ <ᴛᴇᴍᴘʟᴀᴛᴇ>, sᴛᴀᴛᴜs';
    }
    
    await set('autobio', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ᴀᴜᴛᴏ ʙɪᴏ', bodyLines) }, { quoted: msg });
  }
};
