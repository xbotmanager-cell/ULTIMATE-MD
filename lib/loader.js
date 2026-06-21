import fs from 'fs';
import path from 'path';
import { logInfo, logError } from './logger.js';

global.commands = [];
global.events = [];

const scanAndImport = async (dir, type) => {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await scanAndImport(fullPath, type);
    } else if (file.endsWith('.js')) {
      try {
        const fileUrl = 'file://' + path.resolve(fullPath);
        const module = await import(fileUrl);
        const plugin = module.default;
        
        if (type === 'commands' && plugin) {
          global.commands.push(plugin);
          logInfo(`Loaded command: ${plugin.name}`);
        } else if (type === 'events' && plugin) {
          global.events.push(plugin);
          logInfo(`Loaded event: ${file}`);
        }
      } catch (err) {
        logError(`Failed to load ${file}: ${err.message}`);
      }
    }
  }
};

export const loadAll = async () => {
  await scanAndImport('./commands', 'commands');
  await scanAndImport('./events', 'events');
  await scanAndImport('./plugins', 'events'); 
};
