let antilinkStatus = {}; // Store antilink status per group

module.exports = {
  name: "antilink",
  description: "🔒 Enable or disable anti-link system in group",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const isGroup = jid.endsWith("@g.us");
    if (!isGroup) return sock.sendMessage(jid, { text: "❌ This command can only be used in group chats." });

    const sender = msg.key.participant || msg.key.remoteJid;
    const metadata = await sock.groupMetadata(jid);
    const isAdmin = metadata.participants.some(p => p.id === sender && p.admin !== null);
    if (!isAdmin) return sock.sendMessage(jid, { text: "❌ Only group admins can change anti-link settings." });

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
      return sock.sendMessage(jid, {
        text: `⚙️ Usage: *!antilink on* or *!antilink off*\nCurrent Status: *${antilinkStatus[jid] ? "ON" : "OFF"}*`
      });
    }

    antilinkStatus[jid] = status === "on";
    return sock.sendMessage(jid, { text: `✅ Anti-link system is now *${status.toUpperCase()}*.` });
  },

  runEvent(sock) {
    sock.ev.on("messages.upsert", async ({ messages }) => {
      const msg = messages[0];
      if (!msg || !msg.message || msg.key.fromMe) return;

      const jid = msg.key.remoteJid;
      if (!jid.endsWith("@g.us")) return;
      if (!antilinkStatus[jid]) return;

      const sender = msg.key.participant || msg.key.remoteJid;
      const metadata = await sock.groupMetadata(jid);
      const isAdmin = metadata.participants.some(p => p.id === sender && p.admin !== null);
      const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

      const linkRegex = /(https?:\/\/[^\s]+)/gi;
      if (linkRegex.test(messageText) && !isAdmin) {
        // Remove sender and notify group
        await sock.sendMessage(jid, {
          text: `🛡️ *CYBER-MD DETECTED*\n@${sender.split("@")[0]} REMOVED for posting a link.`,
          mentions: [sender]
        });

        await sock.groupParticipantsUpdate(jid, [sender], "remove").catch(() => {
          sock.sendMessage(jid, { text: "⚠️ Couldn't remove the user. Maybe I'm not admin." });
        });
      }
    });
  }
};
