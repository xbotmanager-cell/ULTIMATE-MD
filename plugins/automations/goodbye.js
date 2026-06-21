import { get } from '../../lib/db.js';
import { logError } from '../../lib/logger.js';

let isListening = false;

export default async function goodbye(sock, msg) {
  try {
    if (!isListening) {
      isListening = true;
      sock.ev.on('group-participants.update', async (update) => {
        try {
          const { id, participants, action } = update;
          if (action === 'remove' || action === 'leave') {
             const state = get('goodbye') || { public: false, groups: [], text: 'Goodbye @user from @group!' };
             const enabled = state.public || state.groups.includes(id);

             if (enabled) {
                const groupMetadata = await sock.groupMetadata(id);
                const groupName = groupMetadata.subject;

                for (const num of participants) {
                   let msgText = state.text.replace('@user', `@${num.split('@')[0]}`).replace('@group', groupName);
                   await sock.sendMessage(id, { text: msgText, mentions: [num] });
                }
             }
          }
        } catch (e) {
          logError(`Goodbye event error: ${e.message}`);
        }
      });
    }
  } catch (err) {
    logError(`Goodbye Init Error: ${err.message}`);
  }
}
