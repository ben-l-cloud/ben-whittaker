// ==== commands/hug.js ====
const { gifUrlToMp4Buffer } = require('../lib/media-utils');
const media = require('../media/media.json');

module.exports = {
  name: 'hug',
  description: '🤗 Tuma hug kama video',
  category: 'fun',
  async execute(m, client) {
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(media.hug);
      await client.sendMessage(m.chat, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '🤗 Hug!'
      }, { quoted: m });
    } catch (error) {
      await client.sendMessage(m.chat, { text: '⚠️ Hug imeshindikana.' }, { quoted: m });
    }
  }
};
