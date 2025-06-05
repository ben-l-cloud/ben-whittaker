const { writeFileSync, unlinkSync } = require("fs");
const { spawn } = require("child_process");
const path = require("path");

module.exports = {
  name: "sticker",
  description: "🖼️ Convert image/video to sticker",
  async execute(sock, msg) {
    const mime = msg.message?.imageMessage || msg.message?.videoMessage;
    if (!mime) return sock.sendMessage(msg.key.remoteJid, { text: "📷 Reply to image or video" }, { quoted: msg });

    const type = msg.message.imageMessage ? "image" : "video";
    const stream = await sock.downloadContentFromMessage(msg.message[type + "Message"], type);
    const buffer = Buffer.concat([]);
    for await (const chunk of stream) buffer.push(chunk);

    const tmpPath = `./tmp_${Date.now()}.${type === "image" ? "jpg" : "mp4"}`;
    writeFileSync(tmpPath, buffer);

    const webpPath = tmpPath.replace(/\.(jpg|mp4)/, ".webp");
    const ffmpegArgs = [
      "-i", tmpPath,
      "-vcodec", "libwebp",
      "-vf", "scale=320:320:force_original_aspect_ratio=decrease,fps=15",
      "-lossless", "1",
      "-loop", "0",
      "-preset", "default",
      "-an",
      "-vsync", "0",
      webpPath
    ];

    spawn("ffmpeg", ffmpegArgs)
      .on("close", async () => {
        await sock.sendMessage(msg.key.remoteJid, { sticker: { url: webpPath } }, { quoted: msg });
        unlinkSync(tmpPath);
        unlinkSync(webpPath);
      });
  }
};
