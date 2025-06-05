module.exports = {
  name: "kick",
  description: "Remove a member from the group",
  async execute(sock, msg, args) {
    const { fromMe, key, message, participant } = msg;
    const jid = key.remoteJid;
    const isGroup = jid.endsWith("@g.us");

    if (!isGroup) return await sock.sendMessage(jid, { text: "🚫 This command only works in groups." });

    const groupMetadata = await sock.groupMetadata(jid);
    const sender = msg.participant || msg.key.participant;

    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    const isAdmin = admins.includes(sender);
    const isBotAdmin = admins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");

    if (!isAdmin) return await sock.sendMessage(jid, { text: "🚫 You must be admin to use this command." });
    if (!isBotAdmin) return await sock.sendMessage(jid, { text: "🤖 I need admin rights to perform this action." });

    let target;
    if (msg.message.extendedTextMessage?.contextInfo?.participant) {
      target = msg.message.extendedTextMessage.contextInfo.participant;
    } else if (args[0]?.includes("@")) {
      target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    }

    if (!target) return await sock.sendMessage(jid, { text: "⚠️ Mention or reply to someone to kick." });

    await sock.sendMessage(jid, { text: "🔄 Kicking user..." });
    await sock.groupParticipantsUpdate(jid, [target], "remove");
    await sock.sendMessage(jid, { text: `👢 User removed successfully.` });
  },
};
