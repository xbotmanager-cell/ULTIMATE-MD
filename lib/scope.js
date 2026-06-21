import { get } from './db.js';

export const isEnabledInScope = (key, msg) => {
  const state = get(key) || { public: false, groups: [], chats: [] };
  if (!msg || !msg.key) return state.public;
  
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  
  if (state.public) return true;
  if (isGroup && state.groups && state.groups.includes(from)) return true;
  if (!isGroup && state.chats && state.chats.includes(from)) return true;
  
  return false;
};

export const getScopeState = (key) => {
  return get(key) || { public: false, groups: [], chats: [] };
};
