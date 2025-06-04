const { gifUrlToMp4Buffer } = require('../lib/media-utils');

module.exports = {
  name: 'love',
  description: '❤️ Tuma love',
  category: 'fun',
  async execute(sock, msg, args) {
    const gifUrl = 'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif';
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);
      await sock.sendMessage(msg.key.remoteJid, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '❤️ Nakupenda sana!'
      });
    } catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kutuma love.' });
    }
  }
};
