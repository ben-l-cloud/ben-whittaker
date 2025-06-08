const axios = require('axios');

module.exports = {
  name: 'chatbot',
  description: 'Muulize AI swali lolote (kiswahili/english)',
  category: 'ai',
  async execute(sock, m, args) {
    const question = args.join(" ");
    if (!question) return sock.sendMessage(m.key.remoteJid, { text: "💬 Mfano: !chatbot Eleza historia ya Tanzania." }, { quoted: m });

    try {
      const res = await axios.post('https://api.chatanywhere.com.cn/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }]
      }, {
        headers: { "Authorization": "Bearer YOUR_FREE_API_KEY" }
      });

      const answer = res.data.choices[0].message.content;
      await sock.sendMessage(m.key.remoteJid, { text: answer }, { quoted: m });
    } catch {
      await sock.sendMessage(m.key.remoteJid, { text: "⚠️ Samahani, AI imeshindwa kujibu." }, { quoted: m });
    }
  }
};
