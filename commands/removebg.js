const axios = require("axios");

module.exports = {
  name: "removebg",
  description: "🖼️ Remove image background",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const apiKey = "MUBrw5bSb2jiakasY3x3QzGb";

    if (!msg.message.imageMessage) {
      return sock.sendMessage(from, { text: "📸 Please reply to an image to remove background." }, { quoted: msg });
    }

    await sock.sendMessage(from, { react: { text: "🔄", key: msg.key } });

    const buffer = await sock.downloadMediaMessage(msg.message.imageMessage);

    const form = new FormData();
    form.append("image_file", buffer, { filename: "image.png" });

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        form,
        {
          headers: {
            ...form.getHeaders(),
            "X-Api-Key": apiKey,
          },
          responseType: "arraybuffer",
        }
      );

      const image = Buffer.from(response.data, "binary");
      await sock.sendMessage(from, {
        image,
        caption: "✅ Background removed.",
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(from, { text: "❌ Failed to remove background." }, { quoted: msg });
    }
  }
};
