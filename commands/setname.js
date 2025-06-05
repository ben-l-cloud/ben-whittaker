module.exports = {
  name: "setname",
  description: "✏️ Change the group name (admin only)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const newName = args.join(" ");

    if (!newName) {
      return await sock.sendMessage(jid, { text: "❌ Please provide a new group name." });
    }

    // Send loading message
    await sock.sendMessage(jid, { text: "🕐 Changing group name..." });

    try {
      // Check if group and if sender is admin
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);

      if (!admins.includes(sender)) {
        return await sock.sendMessage(jid, { text: "❌ Only group admins can change the group name." });
      }

      await sock.groupUpdateSubject(jid, newName);

      await sock.sendMessage(jid, { text: `✅ Group name changed to: *${newName}*` });
    } catch (err) {
      await sock.sendMessage(jid, { text: `❌ Failed to change group name.\nError: ${err.message}` });
    }
  },
};
