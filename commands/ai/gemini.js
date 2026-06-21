import { get } from '../../lib/db.js';
import { createBox, formatLine } from '../../system/box.js';
import fs from 'fs';
import path from 'path';

export default {
  name: 'gemini',
  alias: ['ai', 'chat'],
  desc: 'ᴄʜᴀᴛ ᴡɪᴛʜ ɢᴇᴍɪɴɪ ᴀɪ',
  category: 'ai',
  react: '🤖',
  execute: async (sock, msg, args) => {
    const text = args.join(' ');
    if (!text) {
      return sock.sendMessage(msg.key.remoteJid, { text: 'Bruh you forgot to ask something!' }, { quoted: msg });
    }

    const pushName = msg.pushName || 'BrainlessUser';
    const memoryPath = path.resolve(`./memory/${pushName}.json`);

    let history = [];
    if (fs.existsSync(memoryPath)) {
      history = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
    }

    history.push({ role: 'user', content: text });

    // Call Gemini API (using @google/genai syntax)
    let aiResponse = '';
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
         throw new Error('GEMINI API KEY MISSING');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = history.map(m => `${m.role}: ${m.content}`).join('\n') + '\model: ';
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      aiResponse = response.text || 'My brain is currently resting, try again later.';

    } catch (e) {
      aiResponse = 'Wow that knowledge even Google cannot find it. ' + e.message;
    }

    history.push({ role: 'model', content: aiResponse });

    // Limit memory to the last 10 interactions to avoid huge files
    if (history.length > 20) history = history.slice(-20);

    fs.writeFileSync(memoryPath, JSON.stringify(history, null, 2));

    await sock.sendMessage(msg.key.remoteJid, { text: aiResponse }, { quoted: msg });
  }
};
