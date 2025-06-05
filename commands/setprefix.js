// Note: You need a global or accessible config object or environment variable to store prefix.
// This example assumes a global variable called 'botConfig' for prefix, you must adapt accordingly.

let botConfig = {
  prefix: "😁"
};

module.exports = {
  name: "setprefix",
  description: "⚙️ Change the command prefix (Owner only)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const ownerNumber = "255760317060@s.whatsapp.net"; // Change to your owner WhatsApp jid

    const newPrefix = args[0];
    if (!newPrefix) {
      return await sock.sendMessage(jid, { text: `❌ Please provide a new prefix.\nCurrent prefix: ${botConfig.prefix}` });
    }

    if (sender !== ownerNumber) {
      return await sock.sendMessage(jid, { text: "❌ Only the bot owner can change the prefix." });
    }

    await sock.sendMessage(jid, { text: "🕐 Updating prefix..." });

    try {
      botConfig.prefix = newPrefix;

      // If you save prefix to a file or env, do it here (not included in this snippet)

      await sock.sendMessage(jid, { text: `✅ Prefix updated to: *${newPrefix}*` });
    } catch (err) {
      await sock.sendMessage(jid, { text: `❌ Failed to update prefix.\nError: ${err.message}` });
    }
  },
};
