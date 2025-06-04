
// ==== commands/cry.js ====
const { gifUrlToMp4Buffer } = require('../lib/media-utils');
const media = require('../media/media.json');

module.exports = {
  name: 'cry',
  description: '😭 Lia kama video',
  category: 'fun',
  async execute(m, client) {
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(media.cry);
      await client.sendMessage(m.chat, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '😭 Don’t cry!'
      }, { quoted: m });
    } catch (error) {
      await client.sendMessage(m.chat, { text: '⚠️ Cry haikuweza kutumwa.' }, { quoted: m });
    }
  }
};
