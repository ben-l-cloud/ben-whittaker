const fs = require("fs");
const media = JSON.parse(fs.readFileSync("./media/media.json"));

module.exports = {
  name: "kill",
  description: "Send a kill gif to a user",
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
        text: "❌ Reply to a message or mention someone to kill.",
      });
      return;
    }

    await sock.sendMessage(jid, { text: "🔪 Killing in progress..." });

    await sock.sendMessage(jid, {
      video: fs.readFileSync(media.kill),
      gifPlayback: true,
      caption: `💀 *User has been eliminated!*`,
      mentions: [target],
    });
  },
};
