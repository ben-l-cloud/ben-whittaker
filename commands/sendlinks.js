module.exports = {
  name: "sendlinks",
  description: "📢 Send up to 200 actual links to the group (no admin required)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    if (!args.length) {
      return await sock.sendMessage(jid, { text: "❌ Tafadhali tuma links halisi (sawa) kwenye meseji hii." });
    }

    // Punguza idadi ya links mpaka 200 max
    const links = args.slice(0, 200);

    // Tuma links moja baada ya nyingine kwa kuchelewesha kidogo
    for (const link of links) {
      await sock.sendMessage(jid, { text: link });
      await new Promise(resolve => setTimeout(resolve, 300)); // 300ms pause
    }

    await sock.sendMessage(jid, { text: `✅ Done! All ${links.length} links sent.` });
  }
};
