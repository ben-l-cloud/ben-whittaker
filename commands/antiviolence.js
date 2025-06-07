module.exports = {
  name: "antiviolence",
  description: "🕊️ Share Anti-Violence awareness link/message",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    const message = `🕊️ *Say NO to Violence!*\n\nJoin the movement against hate, violence, and discrimination.\n\nClick to learn more: https://www.endviolence.org\n\n✌️ Peace starts with YOU.`;

    await sock.sendMessage(jid, {
      text: message,
    });
  },
};
