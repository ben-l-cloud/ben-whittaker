let goodbyeStatus = {};

module.exports = {
  name: "farewell",
  description: "👋 Enable or disable goodbye messages",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const metadata = await sock.groupMetadata(jid);
    const sender = msg.key.participant;
    const isAdmin = metadata.participants.some(p => p.id === sender && p.admin);

    if (!isAdmin) return sock.sendMessage(jid, { text: "❌ Only admins can enable farewell messages." });

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
      return sock.sendMessage(jid, {
        text: `Usage: *!farewell on/off*\nCurrent: ${goodbyeStatus[jid] ? "ON" : "OFF"}`
      });
    }

    goodbyeStatus[jid] = status === "on";
    await sock.sendMessage(jid, { text: `✅ Farewell is now *${status.toUpperCase()}*.` });
  },

  runEvent(sock) {
    sock.ev.on("group-participants.update", async (update) => {
      const jid = update.id;
      if (!goodbyeStatus[jid]) return;

      for (const user of update.participants) {
        if (update.action === "remove") {
          await sock.sendMessage(jid, {
            text: `👋 @${user.split("@")[0]} has left the group.`,
            mentions: [user]
          });
        }
      }
    });
  }
};
