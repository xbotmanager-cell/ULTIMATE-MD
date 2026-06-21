import { logMessage, logError } from '../lib/logger.js';
import { handleMessage } from '../lib/router.js';

export default {
  name: 'messages.upsert',
  execute: async (sock, { messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      try {
        if (!msg.message) continue;

        const messageType = Object.keys(msg.message)[0];
        const from = msg.key.remoteJid;
        const pushName = msg.pushName || 'Unknown';
        const isGroup = from.endsWith('@g.us');
        const body = msg.message.conversation || 
                     (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || 
                     (msg.message.imageMessage && msg.message.imageMessage.caption) || 
                     (msg.message.videoMessage && msg.message.videoMessage.caption) || '';

        logMessage({
          msg: body.slice(0, 50) + (body.length > 50 ? '...' : ''),
          from: isGroup ? 'Group' : 'Private',
          where: from,
          name: pushName,
          jid: msg.key.participant || from,
          type: messageType
        });

        // Execute all automations
        if (global.automations) {
          for (const auto of global.automations) {
            try {
              auto(sock, msg).catch(e => {
                console.log(`\u001b[31m╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\u001b[0m`);
                console.log(`\u001b[31m│ ERROR: ${e.message}\u001b[0m`);
                console.log(`\u001b[31m│ FROM : ${pushName}\u001b[0m`);
                console.log(`\u001b[31m│ WHERE: ${from}\u001b[0m`);
                console.log(`\u001b[31m│ STACK: ${e.stack ? e.stack.split('\n')[1] : 'N/A'}\u001b[0m`);
                console.log(`\u001b[31m╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\u001b[0m`);
              });
            } catch (err) {
                console.log(`\u001b[31m╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\u001b[0m`);
                console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
                console.log(`\u001b[31m│ FROM : ${pushName}\u001b[0m`);
                console.log(`\u001b[31m│ WHERE: ${from}\u001b[0m`);
                console.log(`\u001b[31m│ STACK: ${err.stack ? err.stack.split('\n')[1] : 'N/A'}\u001b[0m`);
                console.log(`\u001b[31m╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\u001b[0m`);
            }
          }
        }

        // Pass message to router for command processing
        await handleMessage(sock, msg);
      } catch (err) {
        console.log(`\u001b[31m╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\u001b[0m`);
        console.log(`\u001b[31m│ ERROR: ${err.message}\u001b[0m`);
        console.log(`\u001b[31m│ FROM : ${msg.pushName || 'Unknown'}\u001b[0m`);
        console.log(`\u001b[31m│ WHERE: ${msg.key?.remoteJid || 'Unknown'}\u001b[0m`);
        console.log(`\u001b[31m│ STACK: ${err.stack ? err.stack.split('\n')[1] : 'N/A'}\u001b[0m`);
        console.log(`\u001b[31m╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\u001b[0m`);
      }
    }
  }
};
