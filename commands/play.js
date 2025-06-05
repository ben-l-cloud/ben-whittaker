const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');

module.exports = {
  name: "play",
  description: "Play audio from YouTube without API",
  async execute(sock, msg, args) {
    const { key } = msg;
    const from = key.remoteJid;

    if (!args.length) return sock.sendMessage(from, { text: "🔍 Please provide a song name to search!" });

    const query = args.join(" ");
    const res = await yts(query);
    const video = res.videos[0];

    if (!video) return sock.sendMessage(from, { text: "❌ No results found." });

    const audioStream = ytdl(video.url, { filter: "audioonly" });
    const audioPath = `./temp/${video.videoId}.mp3`;

    const writeStream = fs.createWriteStream(audioPath);
    audioStream.pipe(writeStream);

    writeStream.on("finish", async () => {
      await sock.sendMessage(from, {
        document: fs.readFileSync(audioPath),
        mimetype: 'audio/mp4',
        fileName: `${video.title}.mp3`,
        caption: `🎧 *Now Playing:* ${video.title}\n\n⏱️ Duration: ${video.timestamp}\n📥 Source: YouTube`,
      });
      fs.unlinkSync(audioPath);
    });

    await sock.sendMessage(from, { text: "⏳ *Searching & downloading audio...*" });
  },
};
