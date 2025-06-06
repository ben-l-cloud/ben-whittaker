if (body.startsWith("!ytmp4 ")) {
  await sock.sendMessage(from, { react: { text: "🎬", key: msg.key }});

  const url = body.split(" ")[1];
  const ytdl = require("ytdl-core");
  const fs = require("fs");
  const { join } = require("path");

  if (!ytdl.validateURL(url)) {
    return await sock.sendMessage(from, { text: "❌ Invalid YouTube URL." }, { quoted: msg });
  }

  await sock.sendMessage(from, { text: "📥 Downloading video..." }, { quoted: msg });

  try {
    const path = join(__dirname, "video.mp4");
    const stream = fs.createWriteStream(path);

    ytdl(url, { filter: "audioandvideo", quality: "highest" }).pipe(stream);

    stream.on("finish", async () => {
      await sock.sendMessage(from, {
        video: { url: path },
        caption: "✅ Video downloaded!",
      }, { quoted: msg });

      // Optional: delete the file after sending
      fs.unlinkSync(path);
    });

    stream.on("error", async (err) => {
      console.error("Download error:", err);
      await sock.sendMessage(from, { text: "❌ Failed to download video." }, { quoted: msg });
    });

  } catch (err) {
    console.error("Processing error:", err);
    await sock.sendMessage(from, { text: "❌ Something went wrong." }, { quoted: msg });
  }
}
