const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'slap',
  description: '👋💥 Tuma slap gif',
  category: 'fun',
  async execute(sock, msg, from, args) {
    try {
      const slapPath = path.join(__dirname, '../cyber-md/slap.mp4');

      if (!fs.existsSync(slapPath)) {
        await sock.sendMessage(from, { text: '❌ slap.mp4 haijapatikana!' }, { quoted: msg });
        return;
      }

      await sock.sendMessage(from, {
        video: fs.readFileSync(slapPath),
        gifPlayback: true,
        caption: '👋💥 Slap!'
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ Slap error:', err);
      await sock.sendMessage(from, { text: '⚠️ Kulitokea tatizo kutuma slap.' }, { quoted: msg });
    }
  }
};
