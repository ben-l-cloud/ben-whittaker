const ytpl = require('ytpl');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {
  name: "playlist",
  description: "Download songs from YouTube playlist (no API key)",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (!args.length) return sock.sendMessage(from, { text: "🎶 Please provide playlist URL!" });

    const playlistUrl = args[0];
    if (!ytpl.validateID(playlistUrl) && !playlistUrl.includes('list=')) {
      return sock.sendMessage(from, { text: "❌ Invalid YouTube playlist URL." });
    }

    const playlist = await ytpl(playlistUrl, { pages: 1 });
    const videos = playlist.items.slice(0, 5); // limit to first 5 songs

    await sock.sendMessage(from, { text: `🎵 Downloading first ${videos.length} songs from playlist: ${playlist.title}` });

    for (const video of videos) {
      const audioStream = ytdl(video.url, { filter: 'audioonly' });
      const audioPath = `./temp/${video.id}.mp3`;
      const writeStream = fs.createWriteStream(audioPath);
      audioStream.pipe(writeStream);

      await new Promise(resolve => {
        writeStream.on('finish', resolve);
      });

      await sock.sendMessage(from, {
        document: fs.readFileSync(audioPath),
        mimetype: 'audio/mp4',
        fileName: `${video.title}.mp3`,
        caption: `🎧 ${video.title}`,
      });

      fs.unlinkSync(audioPath);
    }
  },
};
