import { createBox, formatLine } from '../../system/box.js';
import { get } from '../../lib/db.js';
import { GoogleGenAI } from '@google/genai';

export default {
  name: 'help',
  alias: ['h', 'menuhelp'],
  desc: 'Get modern, fun explanation of a command.',
  category: 'general',
  execute: async (sock, msg, args) => {
    const cmdName = args[0]?.toLowerCase();
    
    if (!cmdName) {
      return sock.sendMessage(msg.key.remoteJid, { text: 'Bruh, what command do you need help with? Use: help <command>' }, { quoted: msg });
    }
    
    const command = global.commands.find(c => c.name === cmdName || (c.alias && c.alias.includes(cmdName)));
    
    if (!command) {
      return sock.sendMessage(msg.key.remoteJid, { text: `Command '${cmdName}' not found.` }, { quoted: msg });
    }

    let explanation = command.desc || 'No description provided.';
    const botname = get('botname') || 'ULTIMATE-MD';
    
    // Check if Gemini AI is available
    if (process.env.GEMINI_API_KEY) {
        try {
            await sock.sendMessage(msg.key.remoteJid, { text: '✨ Checking memory banks for an awesome explanation...' }, { quoted: msg });
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const prompt = `Explain what this chat bot command does in a cool, fun, modern, very short slang-filled way that a gen z user would like. Don't be robotic. Command Name: "${command.name}". Base Description: "${command.desc}". Category: "${command.category}". Return only the fun explanation, nothing else. Maximum 2 sentences.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            
            if (response.text) explanation = response.text.trim();
        } catch(e) {
            // fallback to original desc
        }
    }

    const box = createBox(botname, [
        formatLine('ᴄᴏᴍᴍᴀɴᴅ', command.name),
        formatLine('ᴄᴀᴛᴇɢᴏʀʏ', command.category),
        formatLine('ɪɴғᴏ', explanation)
    ]);

    await sock.sendMessage(msg.key.remoteJid, { text: box }, { quoted: msg });
  }
};
