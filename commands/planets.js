module.exports = {
  name: "planets",
  async execute(sock, msg) {
    const list = `🪐 Planets in our Solar System:
- Mercury
- Venus
- Earth
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune`;
    await sock.sendMessage(msg.from, { text: list });
  }
};
