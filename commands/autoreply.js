const axios = require('axios');

module.exports = {
  name: 'autoreply',
  description: 'Washa au zima auto reply ya AI',
  category: 'ai',
  async execute(sock, m, args, settings) {
    const state = args[0];
    if (!["on", "off"].includes(state)) return sock.sendMessage(m.key.remoteJid, { text: "🔁 Tumia: !autoreply on / off" }, { quoted: m });

    settings.autoAI = state === "on";
    await sock.sendMessage(m.key.remoteJid, { text: `✅ Auto Reply AI imewezeshwa: *${state}*` }, { quoted: m });
  }
};
