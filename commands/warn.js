// Warning system storage (replace with DB in real bot)
const warns = {}; // { groupId: { userId: count } }

module.exports = {
  name: "warn",
  description: "⚠️ Warn a member; 3 warns = kick",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Processing warn..." });
    try {
      if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo.mentionedJid) {
        return await sock.sendMessage(jid, { text: "❌ Please tag a user to warn." });
      }
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
      if (!admins.includes(sender)) return await sock.sendMessage(jid, { text: "❌ Only admins can warn members." });

      const userToWarn = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      warns[jid] = warns[jid] || {};
      warns[jid][userToWarn] = (warns[jid][userToWarn] || 0) + 1;

      if (warns[jid][userToWarn] >= 3) {
        await sock.groupParticipantsUpdate(jid, [userToWarn], "remove");
        warns[jid][userToWarn] = 0; // reset after kick
        return await sock.sendMessage(jid, { text: `❗️User @${userToWarn.split("@")[0]} removed after 3 warnings.`, mentions: [userToWarn] });
      } else {
        await sock.sendMessage(jid, { text: `⚠️ Warned @${userToWarn.split("@")[0]}. Total warns: ${warns[jid][userToWarn]}/3`, mentions: [userToWarn] });
      }
    } catch (error) {
      await sock.sendMessage(jid, { text: `❌ Failed to warn user.\n${error.message}` });
    }
  },
};
