const fs = require("fs");
const path = require("path");

module.exports = {
  name: "kick",
  description: "Send a kick video (kick.mp4) with auto-react 👢",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // ✅ Step 1: React to the command message
    try {
      await sock.sendMessage(jid, {
        react: {
          text: "👢",
          key: msg.key,
        },
      });
    } catch (e) {
      console.log("Auto-react failed:", e.message);
    }

    // ✅ Step 2: Load media path from media.json
    const mediaData = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "media", "media.json")));
    const videoPath = path.join(__dirname, "..", "media", mediaData.kick || "kick.mp4");

    // ✅ Step 3: Check and send video
    if (!fs.existsSync(videoPath)) {
      return await sock.sendMessage(jid, {
        text: "❌ Kick video not found in media folder!",
      }, { quoted: msg });
    }

    const videoBuffer = fs.readFileSync(videoPath);

    // ✅ Step 4: Send video as gif playback
    await sock.sendMessage(jid, {
      video: videoBuffer,
      gifPlayback: true,
      caption: "👢 Boom! Kicked successfully!",
    }, { quoted: msg });
  },
};
