module.exports = {
  name: "whoami",
  description: "👤 Show your phone number",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const number = sender.split("@")[0];

    await sock.sendMessage(from, {
      text: `👋 Hello @${number}, that's your number!`,
      mentions: [sender],
    }, { quoted: msg });
  },
};
