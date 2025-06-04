const { gifUrlToMp4Buffer } = require('../lib/media-utils');

module.exports = {
  name: 'slap',
  description: '👋 Tuma kofi',
  category: 'fun',
  async execute(sock, msg, args) {
    const gifUrl = 'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif';
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);
      await sock.sendMessage(msg.key.remoteJid, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '👋 Makofi mazito hayo!'
      });
    } catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kutuma slap.' });
    }
  }
};
