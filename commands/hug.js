const { gifUrlToMp4Buffer } = require('../lib/media-utils');

module.exports = {
  name: 'hug',
  description: '🤗 Tuma hug',
  category: 'fun',
  async execute(sock, msg, args) {
    const gifUrl = 'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif';
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);
      await sock.sendMessage(msg.key.remoteJid, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '🤗 Kukumbatiana ni vizuri!'
      });
    } catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kutuma hug.' });
    }
  }
};
