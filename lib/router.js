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

  const type = Object.keys(msg.message)[0];
  const body = msg.message.conversation || 
               (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || 
               (msg.message.imageMessage && msg.message.imageMessage.caption) || 
               (msg.message.videoMessage && msg.message.videoMessage.caption) || '';

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
