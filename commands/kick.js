const fs = require("fs");
const path = require("path");

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

    const filePath = path.resolve(media.kick);
    if (!fs.existsSync(filePath)) {
      await sock.sendMessage(jid, { text: "⚠️ Kick video not found!" });
      return;
    }

    await sock.sendMessage(jid, {
      video: fs.readFileSync(filePath),
      gifPlayback: true,
      caption: `🥾 *That must have hurt!*`,
      mentions: [target],
      mimetype: "video/mp4"
    });
  },
};
