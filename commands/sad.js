// ==== commands/sad.js ====
const { gifUrlToMp4Buffer } = require('../lib/media-utils');
const media = require('../media/media.json');

module.exports = {
  name: 'sad',
  description: '😢 Huzunika kidogo',
  category: 'fun',
  async execute(m, client) {
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(media.sad);
      await client.sendMessage(m.chat, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '😢 So sad!'
      }, { quoted: m });
    } catch (error) {
      await client.sendMessage(m.chat, { text: '⚠️ Sad haikuweza kutumwa.' }, { quoted: m });
    }
  }
};
