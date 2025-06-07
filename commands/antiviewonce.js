module.exports = {
  name: "antiviewonce",
  description: "🔓 Unlock and view once media permanently",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted || !quoted.viewOnceMessageV2 || !quoted.viewOnceMessageV2.message) {
      return sock.sendMessage(jid, { text: "❗ Reply to a *view once* image/video to unlock it." });
    }

    const mediaMsg = quoted.viewOnceMessageV2.message;
    const type = Object.keys(mediaMsg)[0];

    if (!["imageMessage", "videoMessage"].includes(type)) {
      return sock.sendMessage(jid, { text: "❌ Only *image* or *video* view-once messages are supported." });
    }

    await sock.sendMessage(jid, {
      [type]: mediaMsg[type],
      caption: "🔓 This was a *View Once* message – now unlocked.",
    }, { quoted: msg });
  },
};
