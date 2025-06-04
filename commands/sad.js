// ==== commands/slap.js ====
const { gifUrlToMp4Buffer } = require('../lib/media-utils');
const media = require('../media/media.json');

module.exports = {
  name: 'slap',
  description: '🖐️ Slap mtu!',
  category: 'fun',
  async execute(m, client) {
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(media.slap);
      await client.sendMessage(m.chat, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '🖐️ Slap!'
      }, { quoted: m });
    } catch (error) {
      await client.sendMessage(m.chat, { text: '⚠️ Slap haikuweza kutumwa.' }, { quoted: m });
    }
  }
};
