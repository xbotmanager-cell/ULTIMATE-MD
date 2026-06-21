import { isEnabledInScope } from '../../lib/scope.js';
import { logError } from '../../lib/logger.js';
import { get, set } from '../../lib/db.js';

let spamTrack = {};

export default async function antispam(sock, msg) {
  try {
    if (msg.key.fromMe) return;
    if (!isEnabledInScope('antispam', msg)) return;

    const sender = msg.key.participant || msg.key.remoteJid;
    const now = Date.now();
    
    if (!spamTrack[sender]) {
      spamTrack[sender] = [];
    }

    spamTrack[sender].push(now);
    
    // remove messages older than 10 seconds
    spamTrack[sender] = spamTrack[sender].filter(time => now - time < 10000);

    const state = get('antispam') || { public: false, groups: [], chats: [], limit: 5, action: 'delete' };
    const limit = state.limit || 5;

    if (spamTrack[sender].length > limit) {
      const jid = msg.key.remoteJid;
      
      try {
        await sock.sendMessage(jid, { delete: msg.key });
      } catch (err) {
        logError(`Antispam Delete Error: ${err.message}`);
      }

      if (state.action === 'kick' && jid.endsWith('@g.us')) {
        try {
          await sock.groupParticipantsUpdate(jid, [sender], 'remove');
        } catch(err) {
          logError(`Antispam kick error: ${err.message}`);
        }
      }
    }
  } catch (err) {
    logError(`Antispam Error: ${err.message}`);
  }
}
