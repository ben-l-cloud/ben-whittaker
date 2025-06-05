// commands/ping.js
module.exports = {
  name: "ping",
  description: "Check bot latency",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const start = Date.now();

    await sock.sendMessage(jid, {
      text: "🏓 Checking ping...",
      forwardingScore: 100,
      isForwarded: true,
    });

    const latency = Date.now() - start;

    await sock.sendMessage(jid, {
      text: `🔗 *BEN WHITTAKER TECH PING*\n\n📡 Latency: *${latency}ms*\n🌐 Status: *Online*`,
      footer: "Ben Whittaker Tech",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: "🌍 Visit Website",
            url: "https://ben-whittaker-tech.onrender.com",
          },
        },
      ],
      forwardingScore: 999,
      isForwarded: true,
    });
  },
};
