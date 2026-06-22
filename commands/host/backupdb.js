import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import { isOwner } from '../../lib/sudo.js';

export default {
  name: 'backupdb',
  desc: 'Host command: backupdb',
  category: 'host',
  execute: async (sock, msg, args) => {
      try {
         const sender = msg.key.participant || msg.key.remoteJid;
         const ownerCheck = isOwner(sock, msg, sender);
         if (!ownerCheck) return sock.sendMessage(msg.key.remoteJid, { text: 'Only the host/owner can use this command.' }, { quoted: msg });

         const botname = get('botname') || 'ULTIMATE-MD';
         let result = 'Command executed.';

         if ('backupdb' === 'ping') {
             result = 'Pong! Speed: ' + Math.floor(Math.random() * 50) + 'ms';
         } else if ('backupdb' === 'uptime') {
             const ut = process.uptime();
             const h = Math.floor(ut / 3600);
             const m = Math.floor((ut % 3600) / 60);
             const s = Math.floor(ut % 60);
             result = `${h}h ${m}m ${s}s`;
         } else if ('backupdb' === 'restart') {
             await sock.sendMessage(msg.key.remoteJid, { text: 'Restarting system...' }, { quoted: msg });
             process.exit(1);
         } else if ('backupdb' === 'shutdown') {
             await sock.sendMessage(msg.key.remoteJid, { text: 'Shutting down system...' }, { quoted: msg });
             process.exit(0);
         } else if ('backupdb' === 'sysinfo') {
             result = `Platform: ${process.platform}\nArch: ${process.arch}\nNode: ${process.version}`;
         } else if ('backupdb' === 'ram') {
             const m = process.memoryUsage();
             result = `RSS: ${(m.rss / 1024 / 1024).toFixed(2)} MB\nHeap: ${(m.heapUsed / 1024 / 1024).toFixed(2)} MB`;
         } else {
             result = 'backupdb - Feature is mocked for now.';
         }

         const box = createBox(botname, [
            formatLine('ʜᴏsᴛ', 'BACKUPDB'),
            formatLine('ʀᴇsᴜʟᴛ', result)
         ]);

         await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
      } catch (e) {
         await sock.sendMessage(msg.key.remoteJid, { text: 'Error in host command.' }, { quoted: msg });
      }
  }
};
