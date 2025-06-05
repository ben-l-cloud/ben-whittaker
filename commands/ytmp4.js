if (body.startsWith("!ytmp4 ")) {
  await sock.sendMessage(from, { react: { text: "🎬", key: msg.key }});
  let url = body.split(" ")[1];
  const ytdl = require("ytdl-core");

  if (!ytdl.validateURL(url)) {
    return await sock.sendMessage(from, { text: "❌ Invalid YouTube URL." });
  }

  await sock.sendMessage(from, { text: "📥 Downloading video..." });

  const { join } = require("path");
  const { createWriteStream } = require("fs");
  const path = join(__dirname, "video.mp4");
  const stream = createWriteStream(path);

  ytdl(url, { filter: "audioandvideo" }).pipe(stream);

  stream.on("finish", async () => {
    await sock.sendMessage(from, {
      video: { url: path },
      caption: "✅ Video downloaded!"
    }, { quoted: msg });
  });
}
