const { gifUrlToMp4Buffer } = require('../lib/media-utils');

module.exports = {
  name: 'kiss',
  description: '💋 Tuma busu',
  category: 'fun',
  async execute(sock, msg, args) {
    const gifUrl = 'https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif';
    try {
      const mp4Buffer = await gifUrlToMp4Buffer(gifUrl);
      await sock.sendMessage(msg.key.remoteJid, {
        video: mp4Buffer,
        mimetype: 'video/mp4',
        caption: '💋 Busu kwa ajili yako!'
      });
    } catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kutuma kiss.' });
    }
  }
};
