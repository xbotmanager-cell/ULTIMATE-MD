export default {
  name: 'sysinfo',
  alias: ['specs'],
  desc: 'ᴄʜᴇᴄᴋ sʏsᴛᴇᴍ ɪɴғᴏ',
  category: 'general',
  react: '💻',
  execute: async (sock, msg, args) => {
    import('os').then(os => {
      const info = `Platform: ${os.platform()}\nArch: ${os.arch()}\nCPUs: ${os.cpus().length}\nRAM Space: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
      sock.sendMessage(msg.key.remoteJid, { text: info }, { quoted: msg });
    });
  }
};
