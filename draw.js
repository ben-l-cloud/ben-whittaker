const axios = require('axios');

module.exports = {
  name: 'draw',
  description: 'Chora picha kwa kutumia AI (Playground)',
  category: 'ai',
  async execute(sock, m, args) {
    const q = args.join(" ");
    if (!q) return sock.sendMessage(m.key.remoteJid, { text: "🖌️ Tuma mfano: !draw mtoto akicheza mvua" }, { quoted: m });

    try {
      const res = await axios.post('https://stablediffusionapi.com/api/v3/text2img', {
        key: 'N992p8YCmTZpd0ihjc0aURf7VJRo3urLizk3YM8vNRkmHLsRPBdHPtExPgLh',
        prompt: q + ", cartoon, digital art, clean lines",
        negative_prompt: 'blurry, low quality',
        width: '512',
        height: '512',
        samples: '1',
        num_inference_steps: '20',
        guidance_scale: 7.5,
        safety_checker: 'no',
        enhance_prompt: 'yes'
      });

      if (res.data.status === 'success') {
        await sock.sendMessage(m.key.remoteJid, {
          image: { url: res.data.output[0] },
          caption: `🎨 Umeomba: ${q}`
        }, { quoted: m });
      } else {
        await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Haikuweza kutengeneza picha." }, { quoted: m });
      }
    } catch {
      await sock.sendMessage(m.key.remoteJid, { text: "❌ Kuna kosa limetokea." }, { quoted: m });
    }
  }
};
