module.exports = {
  name: "oceans",
  async execute(sock, msg) {
    await sock.sendMessage(msg.from, {
      text: `🌊 Major Oceans:\n- Pacific\n- Atlantic\n- Indian\n- Arctic\n- Southern`
    });
  }
};
