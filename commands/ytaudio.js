const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "ytaudio",
  description: "🎵 Download YouTube audio and send it directly",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const link = args[0];

    if (!link || !link.startsWith("http")) {
      return sock.sendMessage(jid, {
        text: "🔗 Tafadhali tuma link sahihi ya YouTube.\nMfano: !ytaudio https://youtube.com/watch?v=XXXX"
      });
    }

    try {
      const info = await ytdl.getInfo(link);
      const title = info.videoDetails.title;
      const audioPath = path.resolve(__dirname, `${Date.now()}.mp3`);

      const stream = ytdl(link, {
        filter: "audioonly",
        quality: "highestaudio"
      });

      const writeStream = fs.createWriteStream(audioPath);
      stream.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      await sock.sendMessage(jid, {
        audio: fs.readFileSync(audioPath),
        mimetype: "audio/mp4",
        ptt: false, // au true kama unataka iwe voice note
        caption: `🎵 *${title}*`,
      });

      fs.unlinkSync(audioPath); // futa file baada ya kutuma

    } catch (err) {
      console.error(err);
      await sock.sendMessage(jid, {
        text: "❌ Imeshindikana kupakua audio. Tafadhali jaribu tena na link nyingine."
      });
    }
  }
};
