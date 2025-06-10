module.exports = {
  name: "pp",
  description: "📷 Get the profile picture of a user",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const target = msg.mentionedJid?.[0] || msg.key.participant || msg.key.remoteJid;

    try {
      const pp = await sock.profilePictureUrl(target, "image");
      await sock.sendMessage(from, {
        image: { url: pp },
        caption: `🖼️ Profile Picture of @${target.split("@")[0]}`,
        mentions: [target]
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(from, {
        text: "⚠️ Couldn't fetch profile picture. The user may not have one.",
      }, { quoted: msg });
    }
  },
};
