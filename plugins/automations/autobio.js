import { get } from '../../lib/db.js';
import { logError } from '../../lib/logger.js';

let bioInterval = null;

export default async function autobio(sock, msg) {
  try {
    const state = get('autobio') || { public: false, text: 'ULTIMATE-MD | Time: {time}' };

    if (state.public && !bioInterval) {
       bioInterval = setInterval(async () => {
         try {
           const freshState = get('autobio') || state;
           if (!freshState.public) {
             clearInterval(bioInterval);
             bioInterval = null;
             return;
           }

           const date = new Date();
           const timeStr = date.toLocaleTimeString('en-US', { hour12: false });
           const dateStr = date.toLocaleDateString();

           let newBio = freshState.text.replace('{time}', timeStr).replace('{date}', dateStr);
           await sock.updateProfileStatus(newBio);
         } catch (e) {
           logError(`Autobio update error: ${e.message}`);
         }
       }, 60000); // 60 seconds
    } else if (!state.public && bioInterval) {
       clearInterval(bioInterval);
       bioInterval = null;
    }
  } catch (err) {
    logError(`Autobio Error: ${err.message}`);
  }
}
