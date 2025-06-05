module.exports = {
  name: "hidetag",
  description: "🕵️ Send a hidden tag message to all group members",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.pushName || "User";
    const message = args.join(" ") || "🔔 Attention everyone!";

    // 🕐 Show loading message
    await sock.sendMessage(jid, { text: "🕐 Loading..." });

    // Get all group members
    const groupMetadata = await sock.groupMetadata(jid);
    const members = groupMetadata.participants.map(p => p.id);

    // Send hidden tag
    await sock.sendMessage(jid, {
      text: `📣 *${sender} says:*\n${message}`,
      mentions: members,
    });
  },
};
