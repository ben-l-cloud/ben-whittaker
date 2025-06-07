module.exports = {
  name: "sendlinks",
  description: "📢 Send 100 links to the group (no admin required)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Mfano wa links 100 (unaweza badilisha na zako halisi)
    const links = [];
    for (let i = 1; i <= 100; i++) {
      links.push(`https://example.com/link${i}`);
    }

    // Tuma links zote moja baada ya nyingine kwa kuchelewesha kidogo
    for (const link of links) {
      await sock.sendMessage(jid, { text: link });

      // Usitumie delay ndogo sana - hii husaidia kuepuka ratelimit
      await new Promise(resolve => setTimeout(resolve, 300)); // 300ms pause
    }

    await sock.sendMessage(jid, { text: "✅ Done! All 100 links sent." });
  }
};
