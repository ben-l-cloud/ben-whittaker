module.exports = {
  name: "gravity",
  async execute(sock, msg) {
    await sock.sendMessage(msg.from, {
      text: "🌍 Earth's gravity is approximately *9.8 m/s²*."
    });
  }
};
