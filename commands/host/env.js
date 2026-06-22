import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';

export default {
  name: 'env',
  desc: 'Host command: env',
  category: 'host',
  execute: async (sock, msg, args) => {
      try {
         const isOwner = msg.key.participant === process.env.OWNER_NUMBER + '@s.whatsapp.net' || msg.key.remoteJid === process.env.OWNER_NUMBER + '@s.whatsapp.net';
         if (!isOwner) return sock.sendMessage(msg.key.remoteJid, { text: 'Only the host/owner can use this command.' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         let result = 'Command executed.';

         if ('env' === 'ping') {
             result = 'Pong! Speed: ' + Math.floor(Math.random() * 50) + 'ms';
         } else if ('env' === 'uptime') {
             const ut = process.uptime();
             const h = Math.floor(ut / 3600);
             const m = Math.floor((ut % 3600) / 60);
             const s = Math.floor(ut % 60);
             result = `${h}h ${m}m ${s}s`;
         } else if ('env' === 'restart') {
             await sock.sendMessage(msg.key.remoteJid, { text: 'Restarting system...' }, { quoted: msg });
             process.exit(1);
         } else if ('env' === 'shutdown') {
             await sock.sendMessage(msg.key.remoteJid, { text: 'Shutting down system...' }, { quoted: msg });
             process.exit(0);
         } else if ('env' === 'sysinfo') {
             result = `Platform: ${process.platform}\nArch: ${process.arch}\nNode: ${process.version}`;
         } else if ('env' === 'ram') {
             const m = process.memoryUsage();
             result = `RSS: ${(m.rss / 1024 / 1024).toFixed(2)} MB\nHeap: ${(m.heapUsed / 1024 / 1024).toFixed(2)} MB`;
         } else {
             result = 'env - Feature is mocked for now.';
         }

         const box = createBox(botname, [
            formatLine('ʜᴏsᴛ', 'ENV'),
            formatLine('ʀᴇsᴜʟᴛ', result)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in host command.' }, { quoted: msg });
      }
  }
};
