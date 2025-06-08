const axios = require('axios');

module.exports = {
  name: 'ai',
  description: 'Jibu swali kwa Kiswahili au Kiingereza kwa kutumia AI',
  async execute(sock, m, args) {
    const from = m.key.remoteJid;
    if (!args.length) {
      return sock.sendMessage(from, { text: '💡 Tafadhali tuma swali, mfano:\n😁ai explain quantum physics\n😁ai elezea nini ni AI' });
    }

    const userQuestion = args.join(" ");

    await sock.sendMessage(from, { text: '⏳ Nakujibu... tafadhali subiri kidogo.' });

    try {
      // Tunamwambia AI a-jibu kwa Kiswahili au Kiingereza kulingana na swali lako
      const prompt = `
      Tafadhali jibu swali hili kwa Kiswahili au Kiingereza kulingana na lugha ya swali: "${userQuestion}"
      Jibu kwa kifupi, kwa lugha ambayo swali limeulizwa.
      `;

      const res = await axios.post('https://chatgpt-api.shn.hk/v1/', {
        messages: [{ role: "user", content: prompt }]
      });

      const reply = res.data.choices[0].message.content;
      await sock.sendMessage(from, { text: '🤖 ' + reply.trim() });
    } catch (err) {
      await sock.sendMessage(from, { text: '❌ Samahani, AI haikuweza kujibu sasa hivi.' });
    }
  }
};
