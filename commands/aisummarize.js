const axios = require('axios');

module.exports = {
  name: 'aisummarize',
  description: 'Fupisha maandishi marefu kwa AI',
  async execute(sock, m, args) {
    const from = m.key.remoteJid;
    if (!args.length) return sock.sendMessage(from, { text: '💡 Tuma maandishi marefu unayotaka kufupishwa, mfano: !aisummarize habari za leo' });

    const text = args.join(" ");

    await sock.sendMessage(from, { text: '⏳ Nanafupisha maandishi yako...' });

    try {
      const prompt = `Please summarize the following text briefly:\n\n${text}`;

      const res = await axios.post('https://chatgpt-api.shn.hk/v1/', {
        messages: [{ role: "user", content: prompt }]
      });

      const summary = res.data.choices[0].message.content;
      await sock.sendMessage(from, { text: '📝 Muhtasari:\n' + summary.trim() });
    } catch (err) {
      await sock.sendMessage(from, { text: '❌ Samahani, sikutengeneza muhtasari.' });
    }
  }
};
