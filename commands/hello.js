async function reactToMessage(sock, msg, emoji) {
  try {
    await sock.sendMessage(msg.key.remoteJid, {
      react: {
        text: emoji,
        key: msg.key,
      },
    });
  } catch (e) {
    console.log("React error:", e.message);
  }
}

module.exports = {
  name: "hello",
  description: "Say hello to the bot",
  async execute(sock, msg, args) {
    await reactToMessage(sock, msg, "👋");
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderId = sender.split("@")[0];
    await sock.sendMessage(
      msg.key.remoteJid,
      {
        text: `👋 Hello @${senderId}! Welcome to *BEN WHITTAKER TECH BOT*. How can I assist you today?`,
        mentions: [sender],
      }
    );
  },
};
