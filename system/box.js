import { smallCaps } from './fonts.js';

export const createBox = (title, items) => {
  const top = `╭─━━━━━━━━━━━━━━━━━─╮\n│   ${smallCaps(title)}\n├─━━━━━━━━━━━━━━━━━─┤`;
  const bottom = `╰─━━━━━━━━━━━━━━━━━─╯`;
  const middle = items.map(line => `│  ${smallCaps(line)}`).join('\n');
  return `${top}\n${middle}\n${bottom}`;
};

export const createMenuBox = (category, items) => {
  const top = `╭─ ${smallCaps(category)} ─╮`;
  const bottom = `╰─━━━━━━━━━─╯`;
  const middle = items.map(item => `│ ➤ ${smallCaps(item)}`).join('\n');
  return `${top}\n${middle}\n${bottom}`;
};

export const formatLine = (label, value) => {
  return `${label.padEnd(6, ' ')} ➤ ${value}`;
};

export const createAliveBox = (botname, lines) => {
  const top = `╭─━━━━━━━━━━━━━━━━━─╮\n│   ${smallCaps(botname)}\n├─━━━━━━━━━━━━━━━━━─┤`;
  const bottom = `╰─━━━━━━━━━━━━━━━━━─╯`;
  const middle = lines.map(line => `│  ${smallCaps(line)}`).join('\n');
  return `${top}\n${middle}\n${bottom}`; 
};

