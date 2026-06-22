import { get } from '../../lib/db.js';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

const memory = {};

export default {
    name: 'pirate',
    alias: ['pirateai'],
    category: 'ai',
    desc: 'Chat with pirate',
    react: '🏴‍☠️',
    execute: async (sock, msg, args) => {
        try {
            const jid = msg.key.remoteJid;
            const input = args.join(' ');
            
            let quotedText = '';
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            if (ctx?.quotedMessage?.conversation) quotedText = ctx.quotedMessage.conversation;
            else if (ctx?.quotedMessage?.extendedTextMessage?.text) quotedText = ctx.quotedMessage.extendedTextMessage.text;
            
            const fullQuery = quotedText ? `${quotedText}\n\n${input || 'Please respond to the above.'}` : input;

            if (!fullQuery) {
                return sock.sendMessage(jid, { text: 'What do you want to talk about?' }, { quoted: msg });
            }

            if (!memory[jid]) memory[jid] = [];
            
            const systemPrompt = `You are PIRATE, created by The Seven Seas. Provide short, clever, and direct answers without using any boxes or formatting artifacts. Keep it conversational.`;
            
            let responseText = '';
            
            if (process.env.GEMINI_API_KEY) {
                try {
                    const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                    let contextStr = memory[jid].map(m => `${m.role}: ${m.content}`).join('\n');
                    let prompt = `System: ${systemPrompt}\n\nPast Conversation:\n${contextStr}\n\nUser: ${fullQuery}\nPIRATE:`;

                    const response = await aiClient.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt
                    });
                    
                    if (response.text) responseText = response.text.trim();
                } catch(e) {
                    console.log('Gemini Error:', e.message);
                }
            }

            if (!responseText) {
                try {
                    const res = await axios.get(`https://api.simsimi.vn/v1/simtalk?text=${encodeURIComponent(fullQuery)}&lc=en`);
                    if (res.data && res.data.message) {
                        responseText = res.data.message;
                    } else {
                        responseText = `(PIRATE API Offline Mode): I read you, but I'm currently without my API key or primary network connection. You said: ${fullQuery}`;
                    }
                } catch(e) {
                    responseText = `(PIRATE): Sorry, my network is heavily congested right now!`;
                }
            }
            
            memory[jid].push({ role: 'User', content: fullQuery });
            memory[jid].push({ role: 'PIRATE', content: responseText });
            
            if (memory[jid].length > 10) {
                memory[jid] = memory[jid].slice(memory[jid].length - 10);
            }

            await sock.sendMessage(jid, { text: responseText }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: 'My brain just crashed! 😂 Try again.' }, { quoted: msg });
        }
    }
};
