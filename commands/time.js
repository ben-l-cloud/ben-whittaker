module.exports = {
  name: "time",
  description: "Onyesha tarehe na saa ya sasa",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Auto-reaction
    await sock.sendMessage(jid, {
      react: { text: "🕒", key: msg.key },
    });

    // Loading message
    await sock.sendMessage(jid, {
      text: "⏳ Fetching current time...",
      forwardingScore: 100,
      isForwarded: true,
    });

    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    const formattedTime = now.toLocaleString("en-US", options);

    const timeMessage = `
🕰️ *CURRENT TIME*
━━━━━━━━━━━━━━━
📅 Date: ${now.toDateString()}
⏰ Time: ${formattedTime}
━━━━━━━━━━━━━━━
📌 Ben Whittaker Tech
    `;

    await sock.sendMessage(jid, {
      text: timeMessage,
      footer: "Ben Whittaker Tech",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: "📍 Visit Website",
            url: "https://ben-whittaker-tech.onrender.com",
          },
        },
      ],
      forwardingScore: 999,
      isForwarded: true,
    });
  },
};
