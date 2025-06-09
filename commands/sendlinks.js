module.exports = {
  name: "sendlinks",
  description: "📢 Tuma hadi link 200 halisi kwa kundi (kutoka kwenye paragraph au list yoyote)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Chukua ujumbe wote kama string moja
    const fullText = args.join(" ");

    // Regex ya kuchuja links zote
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const foundLinks = fullText.match(linkRegex) || [];

    // Chukua link hadi 200 tu
    const validLinks = foundLinks.slice(0, 200);

    if (!validLinks.length) {
      return await sock.sendMessage(jid, { text: "❌ Hakuna links halisi zilizogundulika kwenye ujumbe." });
    }

    // Tuma kila link kwa kuchelewesha 300ms
    for (const link of validLinks) {
      await sock.sendMessage(jid, { text: link });
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    await sock.sendMessage(jid, { text: `✅ Done! Zimetumwa link ${validLinks.length}.` });
  }
};
