const fs = require("fs");

module.exports = {
  name: "kill",
  description: "Send a kill gif to the mentioned/replied user",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.pushName || "Someone";
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant ||
                   msg.key.participant ||
                   msg.key.remoteJid;

    // Loading message
    const loading = await sock.sendMessage(jid, {
      text: "🔪 Killing target... please wait...",
      quoted: msg,
    });

    // Check if user is replied or mentioned
    if (!msg.message.extendedTextMessage && args.length === 0) {
      await sock.sendMessage(jid, {
        text: "⚠️ You must reply to a user or mention them to use this command.",
        quoted: msg,
      });
      return;
    }

    // Send the kill gif
    await sock.sendMessage(jid, {
      video: fs.readFileSync('./media/kill.mp4'),
      gifPlayback: true,
      caption: `💀 ${sender} just killed their enemy!`,
      quoted: msg,
    });

    // Delete loading message
    await sock.sendMessage(jid, { delete: loading.key });
  },
};
