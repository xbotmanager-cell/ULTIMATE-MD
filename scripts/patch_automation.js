import fs from 'fs';
import path from 'path';

const autoDir = path.join(process.cwd(), 'commands', 'automation');
const files = fs.readdirSync(autoDir).filter(f => f.endsWith('.js'));

for (const file of files) {
   const fp = path.join(autoDir, file);
   let content = fs.readFileSync(fp, 'utf-8');

   if (!content.includes('isOwner')) {
       // Insert import if needed
       if (!content.includes("../../lib/sudo.js")) {
           content = content.replace("import { get, set } from '../../lib/db.js';", "import { get, set } from '../../lib/db.js';\nimport { isOwner } from '../../lib/sudo.js';");
       }
       
       // Handle the execution block precisely
       content = content.replace(
           /execute: async \(sock, msg, args\) => \{/,
           `execute: async (sock, msg, args) => {
    const sender = msg.key.participant || msg.key.remoteJid;
    const ownerCheck = isOwner(sock, msg, sender);
    const groupMetadata = msg.key.remoteJid.endsWith('@g.us') ? await sock.groupMetadata(msg.key.remoteJid).catch(() => null) : null;
    const admins = groupMetadata ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];
    const realIsAdmin = admins.includes(sender) || ownerCheck;
    if (!realIsAdmin) return sock.sendMessage(msg.key.remoteJid, { text: 'You need admin or owner rights to use automation controls!' }, { quoted: msg });`
       );
       fs.writeFileSync(fp, content);
   }
}
console.log('Patched automation files with owner/admin checks');
