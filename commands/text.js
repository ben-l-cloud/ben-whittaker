const axios = require("axios");

module.exports = {
  name: "deeptext",
  description: "Generate text using DeepAI",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const query = args.join(" ");
    if (!query) return sock.sendMessage(from, { text: "✍️ Tumia: `😁deeptext your prompt`" }, { quoted: msg });

    try {
      const response = await axios.post(
        "https://api.deepai.org/api/text-generator",
        { text: query },
        { headers: { "Api-Key": "5bfeb575-9bb2-4847-acf4-f32d0d3d713a" } }
      );

      const result = response.data.output;
      await sock.sendMessage(from, {
        text: `🧠 *Generated Text:*\n\n${result}`
      }, { quoted: msg });

    } catch (err) {
      console.error("❌ DeepAI Text Error:", err);
      await sock.sendMessage(from, {
        text: "❌ AI Error: Could not generate response."
      }, { quoted: msg });
    }
  },
};
