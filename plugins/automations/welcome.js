import { get } from '../../lib/db.js';
import { logError } from '../../lib/logger.js';

let isListening = false;

export default async function welcome(sock, msg) {
  try {
    if (!isListening) {
      isListening = true;
      sock.ev.on('group-participants.update', async (update) => {
        try {
          const { id, participants, action } = update;
          if (action === 'add') {
             const state = get('welcome') || { public: false, groups: [], text: 'Welcome @user to @group!' };
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
          logError(`Welcome event error: ${e.message}`);
        }
      });
    }
  } catch (err) {
    logError(`Welcome Init Error: ${err.message}`);
  }
}
