const axios = require('axios');

module.exports = {
  name: 'caption',
  description: 'Tengeneza maneno ya kuelezea picha (image caption)',
  category: 'ai',
  async execute(sock, m, args) {
    if (!m.message.imageMessage) {
      return sock.sendMessage(m.key.remoteJid, { text: "📷 Tuma picha ukiambatanisha na command hii: !caption" }, { quoted: m });
    }

    try {
      const buffer = await sock.downloadMediaMessage(m);
      const res = await axios.post('https://api.openai-proxy.org/v1/caption', buffer, {
        headers: {
          'Content-Type': 'image/jpeg'
        }
      });

      await sock.sendMessage(m.key.remoteJid, { text: `📝 *Maelezo ya picha:*\n${res.data.caption}` }, { quoted: m });
    } catch {
      await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Imeshindikana kuelezea picha." }, { quoted: m });
    }
  }
};
