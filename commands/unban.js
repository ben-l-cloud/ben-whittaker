const fs = require("fs");
const banPath = "./banned.json";

module.exports = {
  name: "unban",
  description: "✅ Unban a user",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.participant || msg.key.participant;
    const group = await sock.groupMetadata(jid);
    const admins = group.participants.filter(p => p.admin).map(p => p.id);
    const isAdmin = admins.includes(sender);

    if (!isAdmin) return sock.sendMessage(jid, { text: "⛔ Only admins can unban." });

    let target =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      msg.message?.extendedTextMessage?.contextInfo?.participant ||
      (args[0] ? args[0].replace(/\D/g, "") + "@s.whatsapp.net" : null);

    if (!target) return sock.sendMessage(jid, { text: "👤 Tag, reply, or provide number to unban." });

    let banned = [];
    if (fs.existsSync(banPath)) banned = JSON.parse(fs.readFileSync(banPath));
    banned = banned.filter(user => user !== target);
    fs.writeFileSync(banPath, JSON.stringify(banned, null, 2));

    await sock.sendMessage(jid, {
      text: `✅ @${target.split("@")[0]} has been unbanned.`,
      mentions: [target],
    });
  },
};
