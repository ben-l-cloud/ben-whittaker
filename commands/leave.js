module.exports = {
  name: "leave",
  description: "👋 Bot leaves the group",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Loading..." });

    await sock.sendMessage(jid, { text: "👋 Bye everyone! I'm leaving the group." });
    await sock.groupLeave(jid);
  },
};
