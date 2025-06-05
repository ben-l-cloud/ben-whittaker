module.exports = {
  name: "ping",
  description: "Check bot latency",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const start = Date.now();

    // Pinga ya kwanza
    await sock.sendMessage(jid, {
      text: "🏓 Checking ping...",
      forwardingScore: 100,
      isForwarded: true
    });

    const latency = Date.now() - start;

    // Link styled ping
    await sock.sendMessage(jid, {
      text: `🔗 *BEN WHITTAKER TECH PING*\n\n📡 Latency: *${latency}ms*\n🌐 Status: *Online*\n\nClick the button below 👇`,
      footer: "https://ben-whittaker-tech.onrender.com",
      forwardingScore: 999,
      isForwarded: true
    });
  }
};
