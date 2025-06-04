const { gifUrlToMp4Buffer } = require('../lib/media-utils');

module.exports = {
  name: 'sad',
  description: '😔 Tuma huzuni',
  category: 'fun',
  async execute(sock, msg, args) {
    const gifUrl = 'https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif';
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);
      await sock.sendMessage(msg.key.remoteJid, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '😔 Nimehuzunika sana...'
      });
    } catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kutuma sad.' });
    }
  }
};
