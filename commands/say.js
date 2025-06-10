module.exports = {
  name: "say",
  description: "💬 Bot repeats your message",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    if (args.length === 0) return await sock.sendMessage(from, { text: "⚠️ Usage: !say <message>" }, { quoted: msg });

    const text = args.join(" ");
    const sent = await sock.sendMessage(from, { text }, { quoted: msg });

    await sock.sendMessage(from, {
      react: { text: "💬", key: sent.key }
    });
  },
};
