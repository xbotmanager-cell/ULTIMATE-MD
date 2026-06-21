const emojis = ['👍', '❤️', '😂', '🔥', '🎉', '👏', '💥', '💯', '✨', '⚡', '💚', '🤯', '🥰', '😎', '🙌'];

export default async function autoreact(sock, msg) {
  if (msg.key.fromMe) return; // Do not react to bot's own messages unless specified
  
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  try {
    await sock.sendMessage(msg.key.remoteJid, {
      react: {
        text: randomEmoji,
        key: msg.key
      }
    });
  } catch (err) {
    // Ignore errors for autoreaction
  }
}
