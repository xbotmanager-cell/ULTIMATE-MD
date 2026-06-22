import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'goodbye',
  alias: ['gb'],
  desc: 'ғᴀʀᴇᴡᴇʟʟ ᴍᴇᴍʙᴇʀs',
  category: 'automation',
  react: '👋',
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
    const isGroup = jid.endsWith('@g.us');
    
    let state = get('goodbye') || { public: false, groups: [], text: 'Goodbye @user from @group!' };
    let res = '';

    if (sub === 'on') {
      state.public = true;
      res = 'ɢᴏᴏᴅʙʏᴇ ᴇɴᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'off') {
      state.public = false;
      res = 'ɢᴏᴏᴅʙʏᴇ ᴅɪsᴀʙʟᴇᴅ ɢʟᴏʙᴀʟʟʏ';
    } else if (sub === 'group') {
      if (!isGroup) return sock.sendMessage(jid, { text: 'Bruh you are not in a group' }, { quoted: msg });
      if (!state.groups.includes(jid)) state.groups.push(jid);
      res = 'ɢᴏᴏᴅʙʏᴇ ᴇɴᴀʙʟᴇᴅ ғᴏʀ ᴛʜɪs ɢʀᴏᴜᴘ';
    } else if (sub === 'text') {
      if (textArg) {
         state.text = textArg;
         res = `ɢᴏᴏᴅʙʏᴇ ᴛᴇxᴛ sᴇᴛ ᴛᴏ:\n${textArg}`;
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
      return sock.sendMessage(jid, { text: createBox('ɢᴏᴏᴅʙʏᴇ', bodyLines) }, { quoted: msg });
    } else {
      res = 'ɪɴᴠᴀʟɪᴅ. ᴜsᴇ: ᴏɴ, ᴏғғ, ɢʀᴏᴜᴘ, ᴛᴇxᴛ <ᴛᴇᴍᴘʟᴀᴛᴇ>, sᴛᴀᴛᴜs';
    }
    
    await set('goodbye', state);
    const bodyLines = [ formatLine('sᴛᴀᴛᴜs', res) ];
    await sock.sendMessage(jid, { text: createBox('ɢᴏᴏᴅʙʏᴇ', bodyLines) }, { quoted: msg });
  }
};
