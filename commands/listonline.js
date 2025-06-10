module.exports = {
  name: "listonline",
  description: "📶 Orodhesha walio online kwenye group",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (!from.endsWith("@g.us")) {
      return await sock.sendMessage(from, { text: "❌ Amri hii inapatikana kwenye magroup tu!" }, { quoted: msg });
    }

    // Subscribe presence updates
    await sock.presenceSubscribe(from);

    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;
    const presences = sock.presence[from] || {};
    const onlineList = [];

    for (const participant of participants) {
      const jid = participant.id;
      const userPresence = presences[jid]?.lastKnownPresence;

      if (userPresence === "available" || userPresence === "composing" || userPresence === "recording") {
        onlineList.push(jid.split("@")[0]);
      }
    }

    const result = onlineList.length > 0
      ? `📶 *Walioko Online Sasa:*\n\n${onlineList.map((num, i) => `🟢 ${i + 1}. @${num}`).join("\n")}`
      : "😴 Hakuna aliyeonekana active kwa sasa.";

    // Tuma list
    const sentMsg = await sock.sendMessage(
      from,
      {
        text: result,
        mentions: onlineList.map(n => n + "@s.whatsapp.net"),
      },
      { quoted: msg }
    );

    // Reakti na emoji ya 📶
    await sock.sendMessage(from, {
      react: {
        text: "📶",
        key: sentMsg.key
      }
    });
  },
};
