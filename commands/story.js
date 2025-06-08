const axios = require('axios');

module.exports = {
  name: 'story',
  description: 'Andika hadithi kwa kutumia AI',
  category: 'ai',
  async execute(sock, m, args) {
    const q = args.join(" ");
    if (!q) return sock.sendMessage(m.key.remoteJid, { text: "📖 Tuma mada ya hadithi: !story simba aliyecheka" }, { quoted: m });

    try {
      const prompt = `Andika hadithi fupi kuhusu: ${q}`;
      const res = await axios.post('https://api.chatanywhere.com.cn/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      }, {
        headers: { "Authorization": "Bearer YOUR_FREE_API_KEY" }
      });

      const story = res.data.choices[0].message.content;
      await sock.sendMessage(m.key.remoteJid, { text: `📖 *Hadithi:*\n${story}` }, { quoted: m });
    } catch {
      await sock.sendMessage(m.key.remoteJid, { text: "❌ AI haikuweza kuandika hadithi." }, { quoted: m });
    }
  }
};
