import { get } from './db.js';
import { checkMode } from './modes.js';
import { isSudo, isBanned } from './sudo.js';

export const handleMessage = async (sock, msg) => {
  if (!msg.message) return;

  const currentMode = get('mode') || 'public';
  const jid = msg.key.participant || msg.key.remoteJid;
  
  if (isBanned(jid)) return; // Ignoring banned sudos entirely

  // Check Mode
  if (!checkMode(msg)) {
     if (currentMode === 'maintenance' && !msg.key.fromMe && !isSudo(jid)) {
         // Optionally send maintenance message here if it's a command, but better to just return silently unless specifically asked
         // "responds to all users with predefined maintenance message" -> let's do it if it's a command
     } else {
         return; 
     }
  }

  let realMsg = msg.message;
  let type = Object.keys(realMsg)[0];

  if (type === 'ephemeralMessage' || type === 'viewOnceMessage' || type === 'viewOnceMessageV2' || type === 'documentWithCaptionMessage') {
      realMsg = realMsg[type].message;
      type = Object.keys(realMsg)[0];
  }

  let body = '';
  if (type === 'conversation') body = realMsg.conversation;
  else if (type === 'extendedTextMessage') body = realMsg.extendedTextMessage.text;
  else if (type === 'imageMessage') body = realMsg.imageMessage.caption;
  else if (type === 'videoMessage') body = realMsg.videoMessage.caption;
  else body = '';

  const prefix = get('prefix') || '$';
  
  if (!body.startsWith(prefix)) return;

  if (currentMode === 'maintenance' && !msg.key.fromMe && !isSudo(jid)) {
      const mText = get('maintenance_msg') || 'ʙᴏᴛ ɪs ɪɴ ᴍᴀɪɴᴛᴇɴᴀɴᴄᴇ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.';
      return sock.sendMessage(msg.key.remoteJid, { text: mText }, { quoted: msg });
  }

  const args = body.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = global.commands.find(cmd => 
    cmd.name === commandName || 
    (cmd.alias && cmd.alias.includes(commandName))
  );

  if (command) {
    try {
      if (currentMode === 'eco') {
          // Delay processing by 3 seconds
          await new Promise(r => setTimeout(r, 3000));
      }

      if (command.category === 'group' && !msg.key.remoteJid.endsWith('@g.us')) {
          const mText = '╭─━━━━━━━━━━━━━━━━━─╮\n│   ᴇʀʀᴏʀ ᴀʟᴇʀᴛ \n├─━━━━━━━━━━━━━━━━━─┤\n│ ➤ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ  \n│ ➤ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs sɪʟʟʏ\n╰─━━━━━━━━━━━━━━━━━─╯';
          return sock.sendMessage(msg.key.remoteJid, { text: mText }, { quoted: msg });
      }

      if (command.react) {
        await sock.sendMessage(msg.key.remoteJid, { react: { text: command.react, key: msg.key } });
      }
      await command.execute(sock, msg, args);
    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Wow that magic even Google cannot do. An error occurred.' }, { quoted: msg });
    }
  }
};
