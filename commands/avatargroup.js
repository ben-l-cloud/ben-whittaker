module.exports = {
  name: "avatargroup",
  description: "🖼️ Show group profile picture",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    if (!from.endsWith("@g.us")) {
      return await sock.sendMessage(from, { text: "❌ This command works only in groups." }, { quoted: msg });
    }

    try {
      const url = await sock.profilePictureUrl(from, "image");
      const sent = await sock.sendMessage(from, { image: { url }, caption: "🖼️ Group Avatar" }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "🖼️", key: sent.key } });
    } catch {
      const sent = await sock.sendMessage(from, { text: "⚠️ Could not fetch group profile picture." }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "⚠️", key: sent.key } });
    }
  },
};
