// Note: This requires your bot to implement welcome messages and save them somewhere like a DB or JSON
// Example sets welcome text in memory (you must adapt this to your bot)

let welcomeMessages = {};

module.exports = {
  name: "setwelcome",
  description: "👋 Set welcome message for the group (admin only)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const welcomeText = args.join(" ");
    if (!welcomeText) return await sock.sendMessage(jid, { text: "❌ Please provide welcome message text." });
    await sock.sendMessage(jid, { text: "🕐 Setting welcome message..." });
    try {
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
      if (!admins.includes(sender)) return await sock.sendMessage(jid, { text: "❌ Only admins can set welcome message." });
      welcomeMessages[jid] = welcomeText;
      await sock.sendMessage(jid, { text: "✅ Welcome message set successfully." });
    } catch (error) {
      await sock.sendMessage(jid, { text: `❌ Failed to set welcome message.\n${error.message}` });
    }
  },
};
