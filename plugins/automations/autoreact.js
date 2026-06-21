import { getScopeState, isEnabledInScope } from '../../lib/scope.js';
import { logError } from '../../lib/logger.js';

const emojis = ['👍', '❤️', '😂', '🔥', '🎉', '👏', '💥', '💯', '✨', '⚡', '💚', '🤯', '🥰', '😎', '🙌'];

export default async function autoreact(sock, msg) {
  try {
    if (msg.key.fromMe) return;
    if (!isEnabledInScope('autoreact', msg)) return;
    
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      react: {
        text: randomEmoji,
        key: msg.key
      }
    });
  } catch (err) {
    logError(`Autoreact Error: ${err.message}`);
  }
}
