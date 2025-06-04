const { gifUrlToMp4Buffer } = require('../lib/media-utils');

module.exports = {
  name: 'happy',
  description: '😄 Tuma furaha',
  category: 'fun',
  async execute(sock, msg, args) {
    const gifUrl = 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif';
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);
      await sock.sendMessage(msg.key.remoteJid, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '😄 Nimefurahi sana!'
      });
    } catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kutuma happy.' });
    }
  }
};
