module.exports = {
  name: "periodictable",
  async execute(sock, msg) {
    await sock.sendMessage(msg.from, {
      text: "🔬 There are *118 known elements* in the periodic table."
    });
  }
};
