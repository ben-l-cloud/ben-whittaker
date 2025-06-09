let antideleteStatus = {};

module.exports = {
  name: "antidelete",
  description: "🛡️ Enable or disable anti-delete system",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const metadata = await sock.groupMetadata(jid);
    const sender = msg.key.participant;
    const isAdmin = metadata.participants.some(p => p.id === sender && p.admin);

    if (!isAdmin) return sock.sendMessage(jid, { text: "❌ Only admins can enable or disable anti-delete." });

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
      return sock.sendMessage(jid, {
        text: `Usage: *!antidelete on/off*\nCurrent: ${antideleteStatus[jid] ? "ON" : "OFF"}`
      });
    }

    antideleteStatus[jid] = status === "on";
    await sock.sendMessage(jid, { text: `✅ Anti-delete is now *${status.toUpperCase()}*.` });
  },

  runEvent(sock) {
    sock.ev.on("messages.delete", async ({ messages }) => {
      for (const msg of messages) {
        const jid = msg.key.remoteJid;
        if (!antideleteStatus[jid] || !msg.message || !jid.endsWith("@g.us")) continue;

        const participant = msg.key.participant || msg.participant || msg.key.remoteJid;
        const deletedMessage = msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          (msg.message?.imageMessage ? "[Image]" :
           msg.message?.videoMessage ? "[Video]" :
           msg.message?.documentMessage ? "[Document]" :
           msg.message?.audioMessage ? "[Audio]" : "⚠️ Media Message");

        await sock.sendMessage(jid, {
          text: `🚨 *CYBER-MD ALERT: MESSAGE DELETED*\n👤 @${participant.split("@")[0]} deleted:\n\n💬 ${deletedMessage}`,
          mentions: [participant]
        });
      }
    });
  }
};
