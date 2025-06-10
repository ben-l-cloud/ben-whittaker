module.exports = {
  name: "listonline",
  description: "📶 Orodhesha walio online kwenye group",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    // Hakikisha ni group
    if (!from.endsWith("@g.us")) {
      return await sock.sendMessage(from, { text: "❌ Amri hii inafanya kazi kwenye magroup tu!" }, { quoted: msg });
    }

    // Fetch online presence
    const presence = await sock.presenceSubscribe(from);
    const participants = await sock.groupMetadata(from);

    const onlineList = [];

    for (const participant of participants.participants) {
      const id = participant.id;
      const userPresence = sock.presence?.[id]?.lastKnownPresence || null;

      if (userPresence === "available" || userPresence === "composing" || userPresence === "recording") {
        onlineList.push(id.split("@")[0]);
      }
    }

    const result =
      onlineList.length > 0
        ? `🟢 *Online Members:*\n\n${onlineList.map((n, i) => `${i + 1}. @${n}`).join("\n")}`
        : "🔘 Hakuna member aliye online sasa hivi.";

    await sock.sendMessage(
      from,
      {
        text: result,
        mentions: onlineList.map((n) => n + "@s.whatsapp.net"),
      },
      { quoted: msg }
    );
  },
};
