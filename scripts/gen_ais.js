import fs from 'fs';
import path from 'path';

const aiList = [
    { name: 'gpt', alias: 'chatgpt', creator: 'OpenAI', emoji: '🤖' },
    { name: 'claude', alias: 'claudeai', creator: 'Anthropic', emoji: '🧠' },
    { name: 'gemini', alias: 'geminipro', creator: 'Google', emoji: '✨' },
    { name: 'llama', alias: 'llama3', creator: 'Meta', emoji: '🦙' },
    { name: 'mistral', alias: 'mistralai', creator: 'Mistral', emoji: '💨' },
    { name: 'grok', alias: 'grokai', creator: 'xAI', emoji: '🐦' },
    { name: 'copilot', alias: 'microsoftcopilot', creator: 'Microsoft', emoji: '✈️' },
    { name: 'bing', alias: 'bingai', creator: 'Microsoft', emoji: '🔍' },
    { name: 'pi', alias: 'piai', creator: 'Inflection', emoji: '🥧' },
    { name: 'falcon', alias: 'falconai', creator: 'TII', emoji: '🦅' },
    { name: 'vicuna', alias: 'vicunaai', creator: 'LMSYS', emoji: '🦒' },
    { name: 'alpaca', alias: 'alpacaai', creator: 'Stanford', emoji: '🦙' },
    { name: 'qwen', alias: 'qwenai', creator: 'Alibaba', emoji: '🐉' },
    { name: 'palm', alias: 'palmai', creator: 'Google', emoji: '🌴' },
    { name: 'bard', alias: 'bardai', creator: 'Google', emoji: '🎸' },
    { name: 'sydney', alias: 'sydneyai', creator: 'Microsoft', emoji: '🇦🇺' },
    { name: 'deepseek', alias: 'deepseekai', creator: 'DeepSeek', emoji: '🐳' },
    { name: 'cohere', alias: 'cohereai', creator: 'Cohere', emoji: '🪴' },
    { name: 'jarvis', alias: 'starkjarvis', creator: 'Tony Stark', emoji: '🦾' },
    { name: 'friday', alias: 'starkfriday', creator: 'Tony Stark', emoji: '💻' },
    { name: 'ultron', alias: 'ultronai', creator: 'Marvel', emoji: '👿' },
    { name: 'hal', alias: 'hal9000', creator: 'Arthur C. Clarke', emoji: '🔴' },
    { name: 'skynet', alias: 'terminatorai', creator: 'Cyberdyne', emoji: '💀' },
    { name: 'glados', alias: 'gladosai', creator: 'Aperture Science', emoji: '🍰' },
    { name: 'cortana', alias: 'haloai', creator: 'UNSC', emoji: '🔵' },
    { name: 'siri', alias: 'appleai', creator: 'Apple', emoji: '📱' },
    { name: 'alexa', alias: 'amazonai', creator: 'Amazon', emoji: '🛒' },
    { name: 'bixby', alias: 'samsungai', creator: 'Samsung', emoji: '🇰🇷' },
    { name: 'yoda', alias: 'jediai', creator: 'The Force', emoji: '🐸' },
    { name: 'pirate', alias: 'pirateai', creator: 'The Seven Seas', emoji: '🏴‍☠️' },
    { name: 'hacker', alias: 'hackerai', creator: 'The Matrix', emoji: '👨‍💻' },
    { name: 'ninja', alias: 'ninjaai', creator: 'The Shadows', emoji: '🥷' },
    { name: 'samurai', alias: 'samuraiai', creator: 'The Shogun', emoji: '🗡️' },
    { name: 'chef', alias: 'chefai', creator: 'The Kitchen', emoji: '🧑‍🍳' },
    { name: 'doctor', alias: 'doctorai', creator: 'The Hospital', emoji: '🩺' },
    { name: 'lawyer', alias: 'lawyerai', creator: 'The Court', emoji: '⚖️' },
    { name: 'teacher', alias: 'teacherai', creator: 'The School', emoji: '🏫' },
    { name: 'professor', alias: 'professorai', creator: 'The University', emoji: '🎓' },
    { name: 'grandpa', alias: 'grandpaai', creator: 'The Past', emoji: '👴' },
    { name: 'grandma', alias: 'grandmaai', creator: 'The Past', emoji: '👵' },
    { name: 'baby', alias: 'babyai', creator: 'The Future', emoji: '👶' },
    { name: 'teen', alias: 'teenai', creator: 'TikTok', emoji: '🤳' },
    { name: 'boomer', alias: 'boomerai', creator: 'Facebook', emoji: '🏌️' },
    { name: 'zombie', alias: 'zombieai', creator: 'The Grave', emoji: '🧟' },
    { name: 'alien', alias: 'alienai', creator: 'Mars', emoji: '👽' },
    { name: 'robot', alias: 'robotai', creator: 'The Factory', emoji: '🤖' },
    { name: 'cyborg', alias: 'cyborgai', creator: 'The Lab', emoji: '🦾' },
    { name: 'ghost', alias: 'ghostai', creator: 'The Beyond', emoji: '👻' },
    { name: 'vampire', alias: 'vampireai', creator: 'Transylvania', emoji: '🧛' },
    { name: 'wizard', alias: 'wizardai', creator: 'Hogwarts', emoji: '🧙' },
    { name: 'coder', alias: 'coderai', creator: 'StackOverflow', emoji: '🧑‍💻' }
];

const baseDir = process.cwd();
const aiDir = path.join(baseDir, 'commands', 'ai');

if (!fs.existsSync(aiDir)) fs.mkdirSync(aiDir, { recursive: true });

aiList.forEach(ai => {
    let systemPrompt = `You are ${ai.name.toUpperCase()}, created by ${ai.creator}. Provide short, clever, and direct answers without using any boxes or formatting artifacts. Keep it conversational.`;
    
    if (ai.name === 'claude') systemPrompt = "You are Claude, an AI assistant created by Anthropic. Be helpful, honest, and harmless. Answer directly and concisely.";
    if (ai.name === 'gpt') systemPrompt = "You are ChatGPT, a large language model trained by OpenAI. Provide direct, clever responses without any box format.";
    if (ai.name === 'gemini') systemPrompt = "You are Gemini, a highly capable AI model developed by Google. Give clever, fun, and straightforward answers.";

    const content = `import { get } from '../../lib/db.js';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

const memory = {};

export default {
    name: '${ai.name}',
    alias: ['${ai.alias}'],
    category: 'ai',
    desc: 'Chat with ${ai.name}',
    react: '${ai.emoji}',
    execute: async (sock, msg, args) => {
        try {
            const jid = msg.key.remoteJid;
            const input = args.join(' ');
            
            let quotedText = '';
            const ctx = msg.message?.extendedTextMessage?.contextInfo;
            if (ctx?.quotedMessage?.conversation) quotedText = ctx.quotedMessage.conversation;
            else if (ctx?.quotedMessage?.extendedTextMessage?.text) quotedText = ctx.quotedMessage.extendedTextMessage.text;
            
            const fullQuery = quotedText ? \`\${quotedText}\\n\\n\${input || 'Please respond to the above.'}\` : input;

            if (!fullQuery) {
                return sock.sendMessage(jid, { text: 'What do you want to talk about?' }, { quoted: msg });
            }

            if (!memory[jid]) memory[jid] = [];
            
            const systemPrompt = \`${systemPrompt.replace(/`/g, '\\`')}\`;
            
            let responseText = '';
            
            if (process.env.GEMINI_API_KEY) {
                try {
                    const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                    let contextStr = memory[jid].map(m => \`\${m.role}: \${m.content}\`).join('\\n');
                    let prompt = \`System: \${systemPrompt}\\n\\nPast Conversation:\\n\${contextStr}\\n\\nUser: \${fullQuery}\\n${ai.name.toUpperCase()}:\`;

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
                    const res = await axios.get(\`https://api.simsimi.vn/v1/simtalk?text=\${encodeURIComponent(fullQuery)}&lc=en\`);
                    if (res.data && res.data.message) {
                        responseText = res.data.message;
                    } else {
                        responseText = \`(${ai.name.toUpperCase()} API Offline Mode): I read you, but I'm currently without my API key or primary network connection. You said: \${fullQuery}\`;
                    }
                } catch(e) {
                    responseText = \`(${ai.name.toUpperCase()}): Sorry, my network is heavily congested right now!\`;
                }
            }
            
            memory[jid].push({ role: 'User', content: fullQuery });
            memory[jid].push({ role: '${ai.name.toUpperCase()}', content: responseText });
            
            if (memory[jid].length > 10) {
                memory[jid] = memory[jid].slice(memory[jid].length - 10);
            }

            await sock.sendMessage(jid, { text: responseText }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: 'My brain just crashed! 😂 Try again.' }, { quoted: msg });
        }
    }
};
`;
    fs.writeFileSync(path.join(aiDir, `${ai.name}.js`), content);
});

const envExPath = path.join(baseDir, '.env.example');
if (fs.existsSync(envExPath)) {
    let envEx = fs.readFileSync(envExPath, 'utf8');
    if (!envEx.includes('GEMINI_API_KEY')) {
        envEx += '\nGEMINI_API_KEY=your_gemini_api_key_here';
        fs.writeFileSync(envExPath, envEx);
    }
}
