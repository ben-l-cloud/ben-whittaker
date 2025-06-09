module.exports = {
  name: "kick",
  description: "Tuma kick GIF/video",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const mediaDb = require("../media/media.json");
    const kickData = mediaDb.kick;
    if (!kickData) {
      return await sock.sendMessage(from, { text: "Kick video haipatikani." }, { quoted: msg });
    }
    await sock.sendMessage(
      from,
      {
        video: { url: kickData.url },
        caption: kickData.caption || "Kick!",
        gifPlayback: true,
      },
      { quoted: msg }
    );
  },
};
