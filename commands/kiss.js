const fs = require('fs');
const path = require('path');
const { gifUrlToMp4Buffer } = require('../lib/media-utils');
const media = require('../media/media.json');

module.exports = {
  name: 'kiss',
  description: '💋 Tuma GIF ya kiss kama video',
  category: 'fun',
  async execute(m, client) {
    try {
      const gifUrl = media.kiss;
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);

      await client.sendMessage(m.chat, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '💋 Here is a kiss!'
      }, { quoted: m });
    } catch (error) {
      console.error('Kosa kwenye kiss.js:', error.message);
      await client.sendMessage(m.chat, { text: '⚠️ Imeshindikana kutuma kiss.' }, { quoted: m });
    }
  }
};
