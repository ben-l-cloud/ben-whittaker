module.exports = {
  name: "broadcast",
  description: "📢 Broadcast message to all chats (owner only)",
  async execute(sock, msg, args) {
    const ownerNumber = "123456789@s.whatsapp.net"; // Change this to your owner number
    const from = msg.key.remoteJid;

    if (msg.key.participant !== ownerNumber) {
      return await sock.sendMessage(from, { text: "❌ You are not authorized to use this command." }, { quoted: msg });
    }

    const text = args.join(" ");
    if (!text) return await sock.sendMessage(from, { text: "⚠️ Usage: !broadcast <message>" }, { quoted: msg });

    // You must implement your own chat list & broadcast logic here
    // For demo, just confirm
    const sent = await sock.sendMessage(from, { text: `📢 Broadcast sent:\n${text}` }, { quoted: msg });

    await sock.sendMessage(from, {
      react: { text: "📢", key: sent.key }
    });
  },
};
