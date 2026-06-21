import { get } from '../../lib/db.js';
import { logError } from '../../lib/logger.js';

export default async function autostatusview(sock, msg) {
  try {
    const state = get('autostatusview') || { public: false };

    if (state.public) {
       const jid = msg.key.remoteJid;
       if (jid === 'status@broadcast' && !msg.key.fromMe) {
          try {
             await sock.readMessages([msg.key]);
          } catch(e) {
             logError(`Autostatusview read error: ${e.message}`);
          }
       }
    }
  } catch (err) {
    logError(`Autostatusview Error: ${err.message}`);
  }
}
