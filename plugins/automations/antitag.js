import { isEnabledInScope } from '../../lib/scope.js';
import { logError } from '../../lib/logger.js';
import { get } from '../../lib/db.js';

export default async function antitag(sock, msg) {
  try {
    if (msg.key.fromMe) return;
    if (!isEnabledInScope('antitag', msg)) return;

    const jid = msg.key.remoteJid;
    if (!jid.endsWith('@g.us')) return;

    const body = msg.message?.conversation || 
                 msg.message?.extendedTextMessage?.text || '';

    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    const state = get('antitag') || { public: false, groups: [], chats: [], max: 10 };
    const maxMentions = state.max || 10;

    if (mentions.length > maxMentions) {
      try {
        await sock.sendMessage(jid, { delete: msg.key });
        const sender = msg.key.participant;
        await sock.sendMessage(jid, { text: `Bruh don't spam tags here! Maximum tags allowed: ${maxMentions}` }, { quoted: msg });
      } catch (err) {
        logError(`Antitag Delete Error: ${err.message}`);
      }
    }
  } catch (err) {
    logError(`Antitag Error: ${err.message}`);
  }
}
