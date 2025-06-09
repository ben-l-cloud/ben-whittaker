module.exports = {
  name: "slap",
  description: "Tuma slap GIF/video",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const mediaDb = require("../media/media.json");
    const slapData = mediaDb.slap;
    if (!slapData) {
      return await sock.sendMessage(from, { text: "Slap video haipatikani." }, { quoted: msg });
    }
    await sock.sendMessage(
      from,
      {
        video: { url: slapData.url },
        caption: slapData.caption || "Slap!",
        gifPlayback: true,
      },
      { quoted: msg }
    );
  },
};
