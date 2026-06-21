import { createBox, formatLine } from '../../system/box.js';

export default {
  name: 'ping',
  alias: ['p'],
  desc: 'ᴄʜᴇᴄᴋ ʙᴏᴛ sᴘᴇᴇᴅ',
  category: 'general',
  react: '⚡',
  execute: async (sock, msg, args) => {
    const start = Date.now();
    
    // Send initial message to calculate latency
    const { key } = await sock.sendMessage(msg.key.remoteJid, { text: 'Pinging...' }, { quoted: msg });
    
    const end = Date.now();
    const ping = end - start;
    
    // Prepare the boxed format
    const bodyLines = [
      formatLine('sᴘᴇᴇᴅ', `${ping}ms`),
      formatLine('sᴛᴀᴛᴜs', 'ᴏɴʟɪɴᴇ')
    ];
    
    const boxMessage = createBox('ᴘᴏɴɢ!', bodyLines);
    
    // Edit the message with the boxed format
    await sock.sendMessage(msg.key.remoteJid, { 
      text: boxMessage,
      edit: key
    });
  }
};
