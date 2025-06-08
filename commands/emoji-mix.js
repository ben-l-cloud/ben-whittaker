const axios = require('axios');

module.exports = {
  name: 'emoji-mix',
  description: 'Changanya emojis mbili kuwa picha moja',
  category: 'fun',
  async execute(sock, m, args) {
    const input = args.join(" ");
    if (!input || !input.includes("+")) return sock.sendMessage(m.key.remoteJid, { text: "✨ Mfano: !emoji-mix 😂+🔥" }, { quoted: m });

    try {
      const [emoji1, emoji2] = input.split("+");
      const res = await axios.get(`https://emojimix-api.onrender.com/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`, {
        responseType: "arraybuffer"
      });

      await sock.sendMessage(m.key.remoteJid, {
        image: Buffer.from(res.data),
        caption: `🔀 Emoji Mix ya ${emoji1} + ${emoji2}`
      }, { quoted: m });
    } catch {
      await sock.sendMessage(m.key.remoteJid, { text: "❌ Emoji hazikuweza kuchanganywa." }, { quoted: m });
    }
  }
};
