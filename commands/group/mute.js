import { createBox, formatLine } from '../../system/box.js';
import { get, set } from '../../lib/db.js';

export default {
  name: 'mute',
  alias: ['m'],
  desc: 'ᴍᴜᴛᴇ ᴍᴇᴍʙᴇʀ',
  category: 'group',
  react: '🔇',
  execute: async (sock, msg, args) => {
    try {
      const isGroup = msg.key.remoteJid.endsWith('@g.us');
      if (!isGroup) return;
      
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const sender = msg.key.participant || msg.key.remoteJid;
      
      const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
      const { isOwner } = await import('../../lib/sudo.js');\n      const realIsAdmin = admins.includes(sender) || isOwner(sock, msg, sender);

      if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'Nice try but you need admin powers for that!' }, { quoted: msg });
      
      let target = msg.message?.extendedTextMessage?.contextInfo?.participant;
      if (!target && msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      if (!target && args[0]) target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'Whom to mute?' }, { quoted: msg });
      
      let ms = 86400000;
      let timeArg = args.find(a => !a.includes('@'));
      if (timeArg) {
        const val = parseInt(timeArg.slice(0, -1));
        const unit = timeArg.slice(-1).toLowerCase();
        if (!isNaN(val)) {
          if (unit === 'm') ms = val * 60 * 1000;
          else if (unit === 'h') ms = val * 60 * 60 * 1000;
          else if (unit === 'd') ms = val * 24 * 60 * 60 * 1000;
          else if (unit === 'w') ms = val * 7 * 24 * 60 * 60 * 1000;
        }
      }
      
      const mutes = get('mutes') || {};
      mutes[msg.key.remoteJid] = mutes[msg.key.remoteJid] || {};
      mutes[msg.key.remoteJid][target] = { expire: Date.now() + ms };
      set('mutes', mutes);
      
      const box = createBox('ᴍᴇᴍʙᴇʀ ᴍᴜᴛᴇᴅ', [
        formatLine('ᴜsᴇʀ', `@${target.split('@')[0]}`),
        formatLine('sᴛᴀᴛᴜs', 'Silence is golden.')
      ]);
      return sock.sendMessage(msg.key.remoteJid, { text: box, mentions: [target] }, { quoted: msg });
    } catch (err) {
      console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Oops that broke something but I survived!' }, { quoted: msg });
    }
  }
};
