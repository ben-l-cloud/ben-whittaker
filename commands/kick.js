const fs = require("fs");
const media = JSON.parse(fs.readFileSync("./media/media.json"));

module.exports = {
  name: "kick",
  description: "Send a kick gif to a user",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const isReply = !!msg.message?.extendedTextMessage?.contextInfo?.participant;
    const target =
      isReply
        ? msg.message.extendedTextMessage.contextInfo.participant
        : msg.message?.conversation?.split(" ")[1] ||
          msg.message?.extendedTextMessage?.text?.split(" ")[1];

    if (!target) {
      await sock.sendMessage(jid, {
        text: "❌ Reply to a message or mention someone to kick.",
      });
      return;
    }

    await sock.sendMessage(jid, { text: "👢 Kicking user..." });

    await sock.sendMessage(jid, {
      video: fs.readFileSync(media.kick),
      gifPlayback: true,
      caption: `🥾 *That must have hurt!*`,
      mentions: [target],
    });
  },
};
