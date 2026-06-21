import { get } from './db.js';
import { isSudo } from './sudo.js';
import { logInfo } from './logger.js';

export const modes = {
  public: {
     desc: 'ʙᴏᴛ ʀᴇsᴘᴏɴᴅs ᴛᴏ ᴇᴠᴇʀʏᴏɴᴇ ɪɴ ɢʀᴏᴜᴘs ᴀɴᴅ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛs',
     active: true,
     check: (msg) => true
  },
  silent: {
     desc: 'ʙᴏᴛ ɪɢɴᴏʀᴇs ᴀʟʟ ᴍᴇssᴀɢᴇs ᴇxᴄᴇᴘᴛ ᴏᴡɴᴇʀ ᴀɴᴅ sᴜᴅᴏ',
     active: false,
     check: (msg) => {
        const jid = msg.key.participant || msg.key.remoteJid;
        const fm = msg.key.fromMe || isSudo(jid);
        if (!fm) {
           logInfo(`\u001b[33mIgnored message in silent mode from ${jid}\u001b[0m`);
        }
        return fm;
     }
  },
  groups: {
     desc: 'ʙᴏᴛ ᴏɴʟʏ ᴘʀᴏᴄᴇssᴇs ᴍᴇssᴀɢᴇs ғʀᴏᴍ ɢʀᴏᴜᴘ ᴄʜᴀᴛs',
     active: false,
     check: (msg) => msg.key.remoteJid.endsWith('@g.us') || msg.key.fromMe
  },
  private: {
     desc: 'ʙᴏᴛ ᴏɴʟʏ ᴘʀᴏᴄᴇssᴇs ᴍᴇssᴀɢᴇs ғʀᴏᴍ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛs',
     active: false,
     check: (msg) => msg.key.remoteJid.endsWith('@s.whatsapp.net') || msg.key.fromMe
  },
  channel: {
     desc: 'ʙᴏᴛ ᴏɴʟʏ ᴘʀᴏᴄᴇssᴇs ᴍᴇssᴀɢᴇs ғʀᴏᴍ ᴄʜᴀɴɴᴇʟs',
     active: false,
     check: (msg) => msg.key.remoteJid.endsWith('@newsletter') || msg.key.fromMe
  },
  ghost: {
     desc: 'ʙᴏᴛ ᴘʀᴏᴄᴇssᴇs ᴍᴇssᴀɢᴇs ʙᴜᴛ sᴇɴᴅs ɴᴏ ʀᴇsᴘᴏɴsᴇ ᴏʀ ᴍᴀʀᴋs ᴏɴʟɪɴᴇ/ʀᴇᴀᴅ',
     active: false,
     check: (msg) => true
  },
  maintenance: {
     desc: 'ʙᴏᴛ ɪs ɪɴ ᴍᴀɪɴᴛᴇɴᴀɴᴄᴇ, ᴏɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ɪᴛ',
     active: false,
     check: (msg) => {
        const jid = msg.key.participant || msg.key.remoteJid;
        return msg.key.fromMe || isSudo(jid);
     }
  },
  eco: {
     desc: 'ʙᴏᴛ ʟɪᴍɪᴛs ʀᴇsᴏᴜʀᴄᴇ ᴜsᴀɢᴇ ᴛᴏ ʀᴇᴅᴜᴄᴇ ᴄᴘᴜ',
     active: false,
     check: (msg) => true
  }
};

export const checkMode = (msg) => {
  const currentMode = get('mode') || 'public';
  if (modes[currentMode]) {
     return modes[currentMode].check(msg);
  }
  return true;
};
