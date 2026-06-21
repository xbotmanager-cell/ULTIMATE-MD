import { logMessage, logError } from '../lib/logger.js';
import { handleMessage } from '../lib/router.js';

export default {
  name: 'messages.upsert',
  execute: async (sock, { messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
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
            auto(sock, msg).catch(e => logError(`Automation error: ${e.message}`));
          } catch (err) {
            logError(`Automation crash: ${err.message}`);
          }
        }
      }

      // Pass message to router for command processing
      try {
        await handleMessage(sock, msg);
      } catch (err) {
        logError(`Error processing message: ${err.message}`);
      }
    }
  }
};
