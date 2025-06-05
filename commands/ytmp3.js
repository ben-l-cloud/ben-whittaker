const ytdl = require("ytdl-core");
const { default: axios } = require("axios");

module.exports = {
  name: "ytmp3",
  description: "Download YouTube audio",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    if (!args[0]) return await sock.sendMessage(jid, { text: "🔗 Send YouTube link!\nExample: !ytmp3 https://youtube.com/..." });

    await sock.sendMessage(jid, { react: { text: "🎧", key: msg.key } });
    await sock.sendMessage(jid, { text: "🎶 Converting to MP3..." });

    try {
      const info = await ytdl.getInfo(args[0]);
      const title = info.videoDetails.title;
      const audio = ytdl(args[0], { filter: "audioonly" });

      await sock.sendMessage(jid, {
        audio: audio,
        mimetype: "audio/mp4",
        fileName: `${title}.mp3`,
        caption: `✅ *Downloaded:* ${title}`
      });
    } catch (e) {
      await sock.sendMessage(jid, { text: "❌ Error downloading audio." });
    }
  },
};
