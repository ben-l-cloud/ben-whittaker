module.exports = {
  name: "prayertimes",
  description: "🕌 Show prayer times for a specified city (default: Makkah)",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const city = args[0] ? args.join(" ") : "Makkah";

    // Loading message
    await sock.sendMessage(jid, {
      text: `⏳ Fetching prayer times for *${city}*...`,
      forwardingScore: 100,
      isForwarded: true,
    });

    // Simple hardcoded example for Makkah (extend with real API if needed)
    const times = {
      Fajr: "04:15 AM",
      Dhuhr: "12:30 PM",
      Asr: "04:00 PM",
      Maghrib: "06:45 PM",
      Isha: "08:15 PM",
    };

    // Compose reply
    let reply = `🕌 Prayer Times for *${city}*\n\n`;
    for (const [prayer, time] of Object.entries(times)) {
      reply += `⏰ *${prayer}:* ${time}\n`;
    }

    await sock.sendMessage(jid, {
      text: reply,
      footer: "Ben Whittaker Tech • Prayer Times",
      forwardingScore: 999,
      isForwarded: true,
    });
  }
};
