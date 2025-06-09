let antideleteStatus = {}; // { 'groupJid': true/false }

module.exports = {
  name: "antidelete",
  description: "♻️ Enable or disable anti-delete in group",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith("@g.us");
    if (!isGroup) return sock.sendMessage(jid, { text: "❌ This command can only be used in groups." });

    const sender = msg.key.participant || msg.key.remoteJid;
    const metadata = await sock.groupMetadata(jid);
    const isAdmin = metadata.participants.find(p => p.id === sender && p.admin !== null);
    if (!isAdmin) return sock.sendMessage(jid, { text: "❌ Only group admins can toggle anti-delete." });

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
      return sock.sendMessage(jid, { text: `⚙️ Usage: *!antidelete on* or *!antidelete off*\nCurrently: *${antideleteStatus[jid] ? "ON" : "OFF"}*` });
    }

    antideleteStatus[jid] = status === "on";
    return sock.sendMessage(jid, { text: `✅ Anti-delete has been turned *${status.toUpperCase()}*.` });
  },

  runEvent(sock) {
    sock.ev.on("messages.delete", async (del) => {
      const { remoteJid, messages } = del;
      const msg = messages[0];
      if (!msg || !msg.message || msg.key.fromMe) return;

      if (!antideleteStatus[remoteJid]) return;

      const sender = msg.key.participant || msg.key.remoteJid;
      if (remoteJid.endsWith("@g.us")) {
        await sock.sendMessage(remoteJid, {
          text: `♻️ Message deleted by @${sender.split("@")[0]}:\n\n*Recovered below 👇*`,
          mentions: [sender],
        });
        await sock.sendMessage(remoteJid, { forward: msg });
      }
    });
  },
};
