import { isEnabledInScope } from '../../lib/scope.js';
import { logError } from '../../lib/logger.js';
import { get } from '../../lib/db.js';

export default async function antilink(sock, msg) {
  try {
    if (msg.key.fromMe) return;
    if (!isEnabledInScope('antilink', msg)) return;

    const body = msg.message?.conversation || 
                 msg.message?.extendedTextMessage?.text || '';

    // Basic link detection
    if (body.match(/chat\.whatsapp\.com|t\.me|https?:\/\//i)) {
      const jid = msg.key.remoteJid;
      
      // Delete message
      try {
        await sock.sendMessage(jid, { delete: msg.key });
      } catch (err) {
        logError(`Antilink Delete Error: ${err.message}`);
      }

      // Check antilink state for actions
      const state = get('antilink') || { public: false, groups: [], chats: [], action: 'delete' };
      
      if (state.action === 'warn') {
        await sock.sendMessage(jid, { text: 'Bruh stop sending links here, consider yourself warned!' }, { quoted: msg });
      } else if (state.action === 'kick' && jid.endsWith('@g.us')) {
        const sender = msg.key.participant;
        try {
          await sock.groupParticipantsUpdate(jid, [sender], 'remove');
          await sock.sendMessage(jid, { text: 'Adios! We do not want links here.' });
        } catch (err) {
          logError(`Antilink Kick Error: ${err.message}`);
        }
      }
    }
  } catch (err) {
    logError(`Antilink Error: ${err.message}`);
  }
}
