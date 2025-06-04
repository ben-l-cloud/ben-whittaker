
// ==== commands/love.js ====
const { gifUrlToMp4Buffer } = require('../lib/media-utils');
const media = require('../media/media.json');

module.exports = {
  name: 'love',
  description: '❤️ Tuma upendo kama video',
  category: 'fun',
  async execute(m, client) {
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(media.love);
      await client.sendMessage(m.chat, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '❤️ Love vibes!'
      }, { quoted: m });
    } catch (error) {
      await client.sendMessage(m.chat, { text: '⚠️ Love haikuweza kutumwa.' }, { quoted: m });
    }
  }
};
