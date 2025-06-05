module.exports = {
  name: "owner",
  description: "Mmiliki wa bot",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    
    // Auto-reaction emoji
    await sock.sendMessage(jid, {
      react: { text: "👑", key: msg.key },
    });

    // Loading message
    await sock.sendMessage(jid, {
      text: "🕐 Loading owner info...",
      forwardingScore: 100,
      isForwarded: true,
    });

    // Final styled message
    await sock.sendMessage(jid, {
      text: `👑 *Ben Whittaker Tech Owner*\n\n📱 Number: wa.me/255760317060\n💼 Status: *Available*\n🌐 Website: ben-whittaker-tech.onrender.com`,
      footer: "© Ben Whittaker Tech",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: "📞 Contact Owner",
            url: "https://wa.me/255760317060",
          },
        },
      ],
      forwardingScore: 999,
      isForwarded: true,
    });
  },
};
