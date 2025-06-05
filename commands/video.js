const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');

module.exports = {
  name: "video",
  description: "Download YouTube video (no API)",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (!args.length) return sock.sendMessage(from, { text: "🎬 Please provide a video name!" });

    const query = args.join(" ");
    const res = await yts(query);
    const video = res.videos[0];

    if (!video) return sock.sendMessage(from, { text: "❌ No results found." });

    const videoStream = ytdl(video.url, { quality: 'lowestvideo' });
    const filePath = `./temp/${video.videoId}.mp4`;

    const writeStream = fs.createWriteStream(filePath);
    videoStream.pipe(writeStream);

    writeStream.on("finish", async () => {
      await sock.sendMessage(from, {
        video: fs.readFileSync(filePath),
        caption: `🎥 *${video.title}*\n⏱️ ${video.timestamp}\n🔗 ${video.url}`,
      });
      fs.unlinkSync(filePath);
    });

    await sock.sendMessage(from, { text: "📥 *Downloading video, please wait...*" });
  },
};
