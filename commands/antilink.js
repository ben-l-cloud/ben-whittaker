module.exports = {
  name: "remove",
  description: "❌ Kick a member from the group",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Removing member..." });
    try {
      if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo.mentionedJid) {
        return await sock.sendMessage(jid, { text: "❌ Please tag a member to remove." });
      }
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
      if (!admins.includes(sender)) return await sock.sendMessage(jid, { text: "❌ Only admins can remove members." });

      const userToRemove = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      await sock.groupParticipantsUpdate(jid, [userToRemove], "remove");
      await sock.sendMessage(jid, { text: `✅ Removed @${userToRemove.split("@")[0]} from the group.`, mentions: [userToRemove] });
    } catch (error) {
      await sock.sendMessage(jid, { text: `❌ Failed to remove member.\n${error.message}` });
    }
  },
};
