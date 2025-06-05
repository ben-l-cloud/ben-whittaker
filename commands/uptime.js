const emojis = ["⏳", "🕒", "⌚", "⏰"];
const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

const startTime = Date.now();

module.exports = {
  name: "uptime",
  description: "Show bot uptime",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      react: { text: randomEmoji(), key: msg.key }
    });

    await sock.sendMessage(jid, { text: "⌛ Calculating uptime..." });

    await new Promise(r => setTimeout(r, 1000));

    const uptime = Date.now() - startTime;
    const seconds = Math.floor(uptime / 1000) % 60;
    const minutes = Math.floor(uptime / 60000) % 60;
    const hours = Math.floor(uptime / 3600000);

    await sock.sendMessage(jid, {
      text: `⏳ *Bot Uptime*\n\n🕒 *${hours}h ${minutes}m ${seconds}s*`,
      footer: "Ben Whittaker Tech",
    });
  },
};
