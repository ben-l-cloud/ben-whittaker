const axios = require('axios');

module.exports = {
  name: 'aijoke',
  description: 'Tuma utani/ joke kwa kutumia AI',
  async execute(sock, m, args) {
    const from = m.key.remoteJid;

    await sock.sendMessage(from, { text: '😂 Ninatengeneza utani...' });

    try {
      const prompt = "Tell me a funny, clean joke.";

      const res = await axios.post('https://chatgpt-api.shn.hk/v1/', {
        messages: [{ role: "user", content: prompt }]
      });

      const joke = res.data.choices[0].message.content;
      await sock.sendMessage(from, { text: '🤣 Utani:\n' + joke.trim() });
    } catch (err) {
      await sock.sendMessage(from, { text: '❌ Samahani, sikupata utani.' });
    }
  }
};
