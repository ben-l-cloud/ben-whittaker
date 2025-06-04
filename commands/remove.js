const { gifUrlToMp4Buffer } = require('../lib/media-utils');

module.exports = {
  name: 'cry',
  description: '😢 Tuma kulia',
  category: 'fun',
  async execute(sock, msg, args) {
    const gifUrl = 'https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif';
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);
      await sock.sendMessage(msg.key.remoteJid, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '😢 Pole sana, usilie...'
      });
    } catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kutuma cry.' });
    }
  }
};
