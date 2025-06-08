module.exports = {
  name: "humancell",
  async execute(sock, msg) {
    await sock.sendMessage(msg.from, {
      text: "🧬 The human body is made up of approximately *37.2 trillion cells*."
    });
  }
};
