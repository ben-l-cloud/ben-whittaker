const fs = require("fs");
const path = "./banned.json";

module.exports = {
  name: "ban",
  description: "🚷 Ban a user from using the bot",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!mention) return sock.sendMessage(jid, { text: "👤 Tag a user to ban." });

    let banned = [];
    if (fs.existsSync(path)) banned = JSON.parse(fs.readFileSync(path));
    if (!banned.includes(mention)) banned.push(mention);
    fs.writeFileSync(path, JSON.stringify(banned, null, 2));

    await sock.sendMessage(jid, {
      text: `🚫 @${mention.split("@")[0]} is now *banned* from using the bot.`,
      mentions: [mention],
    });
  },
};
