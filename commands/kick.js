const path = require("path");
const fs = require("fs");

module.exports = {
  name: "kick",
  description: "Send a kick GIF/video with auto react",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Auto react with 👢 emoji (reacting to the message itself)
    try {
      await sock.sendMessage(jid, {
        react: {
          text: "👢",
          key: msg.key,
        },
      });
    } catch (e) {
      console.log("React error:", e.message);
    }

    // Path to kick.gif in media folder
    const gifPath = path.join(__dirname, "..", "media", "kick.gif");
    if (!fs.existsSync(gifPath)) {
      return await sock.sendMessage(jid, { text: "❌ Kick media not found!" });
    }

    const gifBuffer = fs.readFileSync(gifPath);

    // Send the GIF as a video with caption; no mention needed even if reply
    await sock.sendMessage(jid, {
      video: gifBuffer,
      gifPlayback: true,
      caption: "👢 Kicking action!",
    }, { quoted: msg });
  },
};
