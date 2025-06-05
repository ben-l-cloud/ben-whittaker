const os = require("os");
const emojis = ["📈", "💻", "📊"];
const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

module.exports = {
  name: "stats",
  description: "Show system stats",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      react: { text: randomEmoji(), key: msg.key }
    });

    await sock.sendMessage(jid, { text: "⌛ Fetching system stats..." });

    await new Promise(r => setTimeout(r, 1500));

    const memUsage = (os.totalmem() - os.freemem()) / (1024 * 1024);
    const totalMem = os.totalmem() / (1024 * 1024);

    await sock.sendMessage(jid, {
      text: `📈 *System Stats*\n\n💾 Memory Usage: ${memUsage.toFixed(2)} MB / ${totalMem.toFixed(2)} MB\n🖥️ Platform: ${os.platform()}\n🔧 CPUs: ${os.cpus().length}`,
      footer: "Ben Whittaker Tech",
    });
  },
};
