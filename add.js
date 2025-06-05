module.exports = {
  name: "add",
  description: "➕ Add a user to group",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Loading..." });

    const group = await sock.groupMetadata(jid);
    const admins = group.participants.filter(p => p.admin).map(p => p.id);
    const sender = msg.participant || msg.key.participant;
    const isAdmin = admins.includes(sender);
    const isBotAdmin = admins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");

    if (!isAdmin) return sock.sendMessage(jid, { text: "⛔ Only admins can add." });
    if (!isBotAdmin) return sock.sendMessage(jid, { text: "🤖 Bot must be admin." });

    const number = args[0]?.replace(/\D/g, "");
    if (!number) return sock.sendMessage(jid, { text: "📞 Provide number to add." });

    const addJid = `${number}@s.whatsapp.net`;
    await sock.groupParticipantsUpdate(jid, [addJid], "add");

    await sock.sendMessage(jid, {
      text: `✅ Added @${number} to group.`,
      mentions: [addJid],
    });
  },
};
