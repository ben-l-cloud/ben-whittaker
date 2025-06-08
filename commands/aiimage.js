const axios = require('axios');

module.exports = {
  name: 'aiimage',
  description: 'Tengeneza picha kwa kutumia AI na maelezo mafupi',
  async execute(sock, m, args) {
    const from = m.key.remoteJid;

    if (!args.length) {
      return sock.sendMessage(from, { text: '🖼️ Tuma maelezo ya picha mfano: !aiimage simba anayekula ndizi' });
    }

    const prompt = args.join(" ");
    await sock.sendMessage(from, { text: '🎨 Ninatengeneza picha yako kwa maelezo haya: ' + prompt });

    try {
      const response = await axios.post('https://stablediffusionapi.com/api/v3/text2img', {
        key: 'N992p8YCmTZpd0ihjc0aURf7VJRo3urLizk3YM8vNRkmHLsRPBdHPtExPgLh',
        prompt: prompt,
        negative_prompt: 'blurry, distorted, bad anatomy, disfigured',
        width: '512',
        height: '512',
        samples: '1',
        num_inference_steps: '20',
        guidance_scale: 7.5,
        safety_checker: 'no',
        enhance_prompt: 'yes'
      });

      if (response.data.status === 'success') {
        const imageUrl = response.data.output[0];
        await sock.sendMessage(from, {
          image: { url: imageUrl },
          caption: `🖼️ Hii hapa picha yako kwa maelezo: *${prompt}*`
        });
      } else {
        await sock.sendMessage(from, { text: '❌ AI haikuweza kutengeneza picha. Jaribu tena.' });
      }

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: '❌ Kulikuwa na tatizo wakati wa kutengeneza picha.' });
    }
  }
};
