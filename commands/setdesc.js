module.exports = {
  name: "setdesc",
  description: "📝 Change group description (admin only)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const newDesc = args.join(" ");
    if (!newDesc) return await sock.sendMessage(jid, { text: "❌ Please provide a new description." });
    await sock.sendMessage(jid, { text: "🕐 Changing group description..." });
    try {
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
      if (!admins.includes(sender)) return await sock.sendMessage(jid, { text: "❌ Only admins can change description." });
      await sock.groupUpdateDescription(jid, newDesc);
      await sock.sendMessage(jid, { text: `✅ Group description updated.` });
    } catch (error) {
      await sock.sendMessage(jid, { text: `❌ Failed to update description.\n${error.message}` });
    }
  },
};
