import { isEnabledInScope, getScopeState } from '../../lib/scope.js';
import { logError } from '../../lib/logger.js';

let messageCache = {};
let isListening = false;

export default async function antidelete(sock, msg) {
  try {
    // Cache the message
    if (msg?.key?.id) {
       messageCache[msg.key.id] = msg;
       // keep cache size reasonable
       const keys = Object.keys(messageCache);
       if (keys.length > 500) {
           delete messageCache[keys[0]];
       }
    }

    if (!isListening) {
      isListening = true;
      sock.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
          if (update.update.status === 4 || update.update.status === 'ERROR') continue; // not sure, but we look for message deletion
        }
      });
      // Baileys actually uses messages.delete for deleted messages or messages.update or message.revoke? 
      // Baileys has 'messages.delete' event.
      sock.ev.on('messages.delete', async (item) => {
        try {
          // item is usually an object containing { keys }
          if (item && item.keys) {
            for (const key of item.keys) {
              const cachedMsg = messageCache[key.id];
              if (cachedMsg) {
                // Check if antidelete is enabled
                const state = getScopeState('antidelete');
                let enabled = state.public;
                const isGroup = key.remoteJid.endsWith('@g.us');
                if (isGroup && state.groups?.includes(key.remoteJid)) enabled = true;
                if (!isGroup && state.chats?.includes(key.remoteJid)) enabled = true;

                if (enabled) {
                   const jid = key.remoteJid;
                   const pushName = cachedMsg.pushName || 'Someone';
                   await sock.sendMessage(jid, { text: `⚠️ *Antidelete*\n${pushName} deleted a message. Re-sending...` });
                   
                   const messageContent = cachedMsg.message;
                   if (messageContent) {
                     // We forward the original message or copy it
                     await sock.sendMessage(jid, { forward: cachedMsg });
                   }
                }
              }
            }
          }
        } catch (e) {
          logError(`Antidelete trigger error: ${e.message}`);
        }
      });
    }
  } catch (err) {
    logError(`Antidelete init Error: ${err.message}`);
  }
}
