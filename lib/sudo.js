import { get, set } from './db.js';
import { logError } from './logger.js';

export const isSudo = (jid) => {
  try {
    const owner = get('owner');
    if (owner && jid.includes(owner)) return true;
    const sudos = get('sudo') || [];
    return sudos.includes(jid);
  } catch (e) {
    logError(`isSudo Error: ${e.message}`);
    return false;
  }
};

export const isBanned = (jid) => {
  try {
    const bans = get('bans') || {};
    if (bans[jid]) {
      if (bans[jid].expire > Date.now()) {
        return true;
      } else {
        delete bans[jid];
        set('bans', bans);
        return false;
      }
    }
    return false;
  } catch (e) {
    logError(`isBanned Error: ${e.message}`);
    return false;
  }
};

export const addSudo = async (jid) => {
  try {
    const sudos = get('sudo') || [];
    if (!sudos.includes(jid)) {
      sudos.push(jid);
      await set('sudo', sudos);
    }
    return true;
  } catch (e) {
    logError(`addSudo Error: ${e.message}`);
    return false;
  }
};

export const delSudo = async (jid) => {
  try {
    let sudos = get('sudo') || [];
    sudos = sudos.filter(j => j !== jid);
    await set('sudo', sudos);
    return true;
  } catch (e) {
    logError(`delSudo Error: ${e.message}`);
    return false;
  }
};

export const banSudo = async (jid, reason, timeMs) => {
  try {
    const bans = get('bans') || {};
    bans[jid] = {
      reason: reason || 'No reason',
      expire: Date.now() + timeMs
    };
    await set('bans', bans);
    return true;
  } catch (e) {
    logError(`banSudo Error: ${e.message}`);
    return false;
  }
};

export const unbanSudo = async (jid) => {
  try {
    const bans = get('bans') || {};
    if (bans[jid]) {
      delete bans[jid];
      await set('bans', bans);
    }
    return true;
  } catch (e) {
    logError(`unbanSudo Error: ${e.message}`);
    return false;
  }
};

export const listSudo = () => {
  try {
    return {
      sudos: get('sudo') || [],
      bans: get('bans') || {}
    };
  } catch (e) {
    logError(`listSudo Error: ${e.message}`);
    return { sudos: [], bans: {} };
  }
};
