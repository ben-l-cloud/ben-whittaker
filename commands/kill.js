module.exports = {
  name: "kill",
  description: "Tuma kill GIF/video",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const mediaDb = require("../media/media.json");
    const killData = mediaDb.kill;
    if (!killData) {
      return await sock.sendMessage(from, { text: "Kill video haipatikani." }, { quoted: msg });
    }
    await sock.sendMessage(
      from,
      {
        video: { url: killData.url },
        caption: killData.caption || "Kill!",
        gifPlayback: true,
      },
      { quoted: msg }
    );
  },
};
