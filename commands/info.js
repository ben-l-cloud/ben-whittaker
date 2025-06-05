const emojis = ["ℹ️", "📊", "📝"];
const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

module.exports = {
  name: "info",
  description: "Show bot info",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      react: { text: randomEmoji(), key: msg.key }
    });

    await sock.sendMessage(jid, { text: "⌛ Gathering info..." });

    await new Promise(r => setTimeout(r, 1200));

    await sock.sendMessage(jid, {
      text: `
*BEN WHITTAKER TECH BOT*

Version: 1.0.0
Developer: Omari Blif
GitHub: https://github.com/ben-l-cloud/ben-whittaker
Language: Node.js (Baileys)
Status: Online
      `,
      footer: "Ben Whittaker Tech",
    });
  },
};
