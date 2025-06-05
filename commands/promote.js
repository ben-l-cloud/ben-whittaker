module.exports = {
  name: "promote",
  description: "Promote a member to admin",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const groupMetadata = await sock.groupMetadata(jid);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    const isBotAdmin = admins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");

    if (!isBotAdmin) return sock.sendMessage(jid, { text: "🤖 I need to be admin to promote someone!" });

    let target = msg.message?.extendedTextMessage?.contextInfo?.participant ||
      (args[0]?.includes("@") && args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net");

    if (!target) return sock.sendMessage(jid, { text: "⚠️ Mention or reply to someone to promote." });

    await sock.sendMessage(jid, { text: "⏳ Promoting user..." });
    await sock.groupParticipantsUpdate(jid, [target], "promote");
    await sock.sendMessage(jid, { text: `🆙 @${target.split("@")[0]} is now an admin!`, mentions: [target] });
  },
};
