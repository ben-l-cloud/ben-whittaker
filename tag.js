module.exports = {
  name: "tag",
  description: "📢 Mention all group members",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Loading..." });

    const group = await sock.groupMetadata(jid);
    const members = group.participants.map(p => p.id);
    const message = `📢 *Group Mention*\n\n👥 Members: ${members.length}\n\n` + members.map(u => `@${u.split("@")[0]}`).join(" ");

    await sock.sendMessage(jid, {
      text: message,
      mentions: members,
    });
  },
};
