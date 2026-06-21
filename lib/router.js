import { get } from './db.js';

export const handleMessage = async (sock, msg) => {
  if (!msg.message) return;

  const type = Object.keys(msg.message)[0];
  const body = msg.message.conversation || 
               (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || 
               (msg.message.imageMessage && msg.message.imageMessage.caption) || 
               (msg.message.videoMessage && msg.message.videoMessage.caption) || '';

  const prefix = get('prefix') || '$';
  
  if (!body.startsWith(prefix)) return;

  const args = body.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = global.commands.find(cmd => 
    cmd.name === commandName || 
    (cmd.alias && cmd.alias.includes(commandName))
  );

  if (command) {
    try {
      if (command.react) {
        await sock.sendMessage(msg.key.remoteJid, { react: { text: command.react, key: msg.key } });
      }
      await command.execute(sock, msg, args);
    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Wow that music even Google cannot find it' }, { quoted: msg });
    }
  }
};
