export const logMessage = (msgData) => {
  const reset = '\u001b[0m';
  const cyan = '\u001b[36m';
  const green = '\u001b[32m';
  const yellow = '\u001b[33m';
  const blue = '\u001b[34m';
  const magenta = '\u001b[35m';
  const red = '\u001b[31m';

  console.log(`${cyan}╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮${reset}`);
  console.log(`${cyan}│ ${green}MSG  : ${reset}${msgData.msg || ''}`);
  console.log(`${cyan}│ ${yellow}FROM : ${reset}${msgData.from || ''}`);
  console.log(`${cyan}│ ${blue}WHERE: ${reset}${msgData.where || ''}`);
  console.log(`${cyan}│ ${magenta}NAME : ${reset}${msgData.name || ''}`);
  console.log(`${cyan}│ ${red}JID  : ${reset}${msgData.jid || ''}`);
  console.log(`${cyan}│ ${cyan}TYPE : ${reset}${msgData.type || ''}`);
  console.log(`${cyan}╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯${reset}`);
};

export const logInfo = (text) => {
  console.log(`\u001b[32m[INFO] ${text}\u001b[0m`);
};
export const logError = (text) => {
  console.log(`\u001b[31m[ERROR] ${text}\u001b[0m`);
};
export const logWarn = (text) => {
  console.log(`\u001b[33m[WARN] ${text}\u001b[0m`);
};
