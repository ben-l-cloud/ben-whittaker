const { gifUrlToMp4Buffer } = require('../lib/media-utils');

module.exports = {
  name: 'dance',
  description: '💃 Tuma dance',
  category: 'fun',
  async execute(sock, msg, args) {
    const gifUrl = 'https://media.giphy.com/media/3o7aD4dH0a1H9w5NQk/giphy.gif';
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);
      await sock.sendMessage(msg.key.remoteJid, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '💃 Cheza kama wewe!'
      });
    } catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kutuma dance.' });
    }
  }
};
