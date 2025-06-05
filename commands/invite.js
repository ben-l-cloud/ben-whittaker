const emojis = ["✉️", "📩", "🔗"];
const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

module.exports = {
  name: "invite",
  description: "Get group invite link",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      react: { text: randomEmoji(), key: msg.key }
    });

    await sock.sendMessage(jid, { text: "⌛ Generating invite link..." });

    await new Promise(r => setTimeout(r, 1000));

    if (!jid.endsWith("@g.us")) {
      return await sock.sendMessage(jid, { text: "❌ This command works only in groups." });
    }

    try {
      const code = await sock.groupInviteCode(jid);
      await sock.sendMessage(jid, {
        text: `🔗 *Group Invite Link*\n\nhttps://chat.whatsapp.com/${code}`,
        footer: "Ben Whittaker Tech",
      });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Failed to get invite link. I might not be admin." });
    }
  },
};
