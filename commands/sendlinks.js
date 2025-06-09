module.exports = {
  name: "sendlinks",
  description: "📢 Tuma hadi link 200 halisi kwa kundi (huhitaji kuwa admin)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!args.length) {
      return await sock.sendMessage(jid, { text: "❌ Tafadhali tuma links halisi (zinazoanza na http:// au https://)." });
    }

    // Chuja links halisi tu (zinazoanza na http:// au https://), chukua hadi 200 tu
    const validLinks = args.filter(link => link.startsWith("http://") || link.startsWith("https://")).slice(0, 200);

    if (!validLinks.length) {
      return await sock.sendMessage(jid, { text: "❌ Hakuna link halisi zilizotumwa." });
    }

    // Tuma link moja moja kwa kuchelewesha kidogo (300ms)
    for (const link of validLinks) {
      await sock.sendMessage(jid, { text: link });
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    await sock.sendMessage(jid, { text: `✅ Done! Zimetumwa link ${validLinks.length}.` });
  }
};
