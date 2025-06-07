const fs = require("fs");
const banPath = "./banned.json";

module.exports = {
  name: "ban",
  description: "❌ Ban a user (reply, tag or number)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.participant || msg.key.participant;
    const group = await sock.groupMetadata(jid);
    const admins = group.participants.filter(p => p.admin).map(p => p.id);
    const isAdmin = admins.includes(sender);

    if (!isAdmin) return sock.sendMessage(jid, { text: "⛔ Only admins can ban." });

    let target =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      msg.message?.extendedTextMessage?.contextInfo?.participant ||
      (args[0] ? args[0].replace(/\D/g, "") + "@s.whatsapp.net" : null);

    if (!target) return sock.sendMessage(jid, { text: "👤 Tag, reply, or provide number to ban." });

    let banned = [];
    if (fs.existsSync(banPath)) banned = JSON.parse(fs.readFileSync(banPath));
    if (!banned.includes(target)) {
      banned.push(target);
      fs.writeFileSync(banPath, JSON.stringify(banned, null, 2));
    }

    await sock.sendMessage(jid, {
      text: `🚫 @${target.split("@")[0]} has been banned.`,
      mentions: [target],
    });
  },
};
