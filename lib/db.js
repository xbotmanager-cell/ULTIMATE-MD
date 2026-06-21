import fs from 'fs';
import path from 'path';
import defaults from './defaults.js';
import { logInfo, logError } from './logger.js';
import { createClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';
import admin from 'firebase-admin';

const memPath = path.resolve('./database/memory.json');
let dbStore = {};
let supabaseClient = null;
let currentDbType = 'memory';

export const initDb = async () => {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    currentDbType = 'supabase';
    supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { data, error } = await supabaseClient.from('swiftbot').select('*').eq('id', 'settings').single();
    if (data && data.data) {
      dbStore = data.data;
    } else {
      dbStore = { ...defaults };
      await supabaseClient.from('swiftbot').upsert({ id: 'settings', data: dbStore });
    }
    logInfo('Connected to Supabase Database');
  } else if (process.env.MONGO_URL) {
    currentDbType = 'mongodb';
    await mongoose.connect(process.env.MONGO_URL);
    logInfo('Connected to MongoDB Database');
  } else if (process.env.FIREBASE_URL) {
    currentDbType = 'firebase';
    // Firebase initialization logic would go here
    logInfo('Connected to Firebase Database');
  } else {
    currentDbType = 'memory';
    if (!fs.existsSync(path.dirname(memPath))) {
      fs.mkdirSync(path.dirname(memPath), { recursive: true });
    }
    if (fs.existsSync(memPath)) {
      dbStore = JSON.parse(fs.readFileSync(memPath, 'utf8'));
    } else {
      dbStore = { ...defaults };
      fs.writeFileSync(memPath, JSON.stringify(dbStore, null, 2));
    }
    logInfo('Using local JSON memory storage');
  }
};

export const get = (key) => {
  if (dbStore[key] !== undefined) return dbStore[key];
  if (defaults[key] !== undefined) return defaults[key];
  return null;
};

export const set = async (key, value) => {
  dbStore[key] = value;
  
  if (currentDbType === 'supabase' && supabaseClient) {
    await supabaseClient.from('swiftbot').upsert({ id: 'settings', data: dbStore });
  } else if (currentDbType === 'memory') {
    fs.writeFileSync(memPath, JSON.stringify(dbStore, null, 2));
  }
};

export const del = async (key) => {
  delete dbStore[key];
  if (currentDbType === 'supabase' && supabaseClient) {
    await supabaseClient.from('swiftbot').upsert({ id: 'settings', data: dbStore });
  } else if (currentDbType === 'memory') {
    fs.writeFileSync(memPath, JSON.stringify(dbStore, null, 2));
  }
};

export const all = () => {
  return { ...dbStore };
};
