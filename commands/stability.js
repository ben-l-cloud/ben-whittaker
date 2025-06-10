const axios = require("axios");

module.exports = {
  name: "stability",
  description: "🎨 Generate image using Stability AI",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const prompt = args.join(" ");
    if (!prompt) return sock.sendMessage(from, { text: "✏️ Provide a prompt! Example: !stability cyberpunk girl" }, { quoted: msg });

    const apiKey = "sk-GPrKV4TIpQ8DHxH5LNbwi5xEIxyVsu47r2SoZrcLjjZbmGuK";

    await sock.sendMessage(from, { react: { text: "🎨", key: msg.key } });

    try {
      const res = await axios.post(
        'https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image',
        {
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          clip_guidance_preset: 'FAST_BLUE',
          height: 512,
          width: 512,
          samples: 1,
          steps: 30,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const base64 = res.data.artifacts[0].base64;
      const buffer = Buffer.from(base64, 'base64');
      await sock.sendMessage(from, {
        image: buffer,
        caption: `🖼️ Prompt: *${prompt}*`,
      }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(from, { text: "❌ Failed to generate image." }, { quoted: msg });
    }
  }
};
