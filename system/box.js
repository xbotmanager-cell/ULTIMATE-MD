import { smallCaps } from './fonts.js';

export const createBox = (title, items) => {
  const top = `╭─━━━━━━━━━━━━━━━━━─╮\n│   ${smallCaps(title)}\n╰─━━━━━━━━━━━━━━━━━─╯`;
  const middle = items.map(line => {
      return line.split('\n').map(part => ` ${smallCaps(part)}`).join('\n');
  }).join('\n\n');
  return `${top}\n\n${middle}`;
};

export const createMenuBox = (category, items) => {
  const top = `╭─ ${smallCaps(category)} ─╮`;
  const bottom = `╰─━━━━━━━━━─╯`;
  const middle = items.map(item => `➤ ${smallCaps(item)}`).join('\n');
  return `${top}\n${middle}\n${bottom}`;
};

export const formatLine = (label, value) => {
  if (!value) return `${label}`;
  return `📌 ${label}:\n   ${value}`;
};

export const createAliveBox = (botname, lines) => {
  const top = `╭─━━━━━━━━━━━━━━━━━─╮\n│   ${smallCaps(botname)}\n╰─━━━━━━━━━━━━━━━━━─╯`;
  const middle = lines.map(line => {
      return line.split('\n').map(part => ` ${smallCaps(part)}`).join('\n');
  }).join('\n');
  return `${top}\n\n${middle}`; 
};

