const axios = require("axios");

module.exports = {
  name: "deepimage",
  description: "Generate image from text using DeepAI",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const prompt = args.join(" ");
    if (!prompt) return sock.sendMessage(from, { text: "🖌️ Tumia: `😁deepimage cat with glasses`" }, { quoted: msg });

    try {
      const response = await axios.post(
        "https://api.deepai.org/api/text2img",
        { text: prompt },
        { headers: { "Api-Key": "5bfeb575-9bb2-4847-acf4-f32d0d3d713a" } }
      );

      const imageUrl = response.data.output_url;
      await sock.sendMessage(from, {
        image: { url: imageUrl },
        caption: `🎨 *Image generated from:* ${prompt}`
      }, { quoted: msg });

    } catch (err) {
      console.error("❌ DeepAI Image Error:", err);
      await sock.sendMessage(from, {
        text: "❌ AI Error: Could not generate image."
      }, { quoted: msg });
    }
  },
};
