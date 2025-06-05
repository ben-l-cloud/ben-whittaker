let welcomeMessages = {}; // same object as setwelcome.js

module.exports = {
  name: "resetwelcome",
  description: "♻️ Reset welcome message (admin only)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Resetting welcome message..." });
    try {
      const metadata = await sock.groupMetadata(jid);
      const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
      if (!admins.includes(sender)) return await sock.sendMessage(jid, { text: "❌ Only admins can reset welcome message." });
      delete welcomeMessages[jid];
      await sock.sendMessage(jid, { text: "✅ Welcome message reset." });
    } catch (error) {
      await sock.sendMessage(jid, { text: `❌ Failed to reset welcome message.\n${error.message}` });
    }
  },
};
