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
        let realMsg = msg.message;
        let msgType = Object.keys(realMsg)[0];

        if (msgType === 'ephemeralMessage') {
           realMsg = realMsg.ephemeralMessage.message;
           msgType = Object.keys(realMsg)[0];
        } else if (msgType === 'documentWithCaptionMessage') {
           realMsg = realMsg.documentWithCaptionMessage.message;
           msgType = Object.keys(realMsg)[0];
        }

        let body = '';
        let displayMsg = '';
        
        if (msgType === 'conversation') {
           body = realMsg.conversation;
           displayMsg = body;
        } else if (msgType === 'extendedTextMessage') {
           body = realMsg.extendedTextMessage.text;
           displayMsg = body;
        } else if (msgType === 'imageMessage') {
           body = realMsg.imageMessage.caption || '';
           displayMsg = `[Image] ${body}`.trim();
        } else if (msgType === 'videoMessage') {
           body = realMsg.videoMessage.caption || '';
           displayMsg = `[Video] ${body}`.trim();
        } else if (msgType === 'documentMessage') {
           displayMsg = `[Document/File] ${realMsg.documentMessage.fileName || ''}`.trim();
        } else if (msgType === 'viewOnceMessage' || msgType === 'viewOnceMessageV2') {
           displayMsg = '[ViewOnce Message]';
        } else {
           displayMsg = `[${msgType}]`;
        }

        logMessage({
          msg: displayMsg.slice(0, 50) + (displayMsg.length > 50 ? '...' : ''),
          from: isGroup ? 'Group' : 'Private',
          where: from,
          name: pushName,
          jid: msg.key.participant || from,
          type: msgType
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
