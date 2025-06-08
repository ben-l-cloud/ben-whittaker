module.exports = {
  name: "largestcountries",
  async execute(sock, msg) {
    const list = `🌐 Top 5 Largest Countries:
1. Russia
2. Canada
3. China
4. USA
5. Brazil`;
    await sock.sendMessage(msg.from, { text: list });
  }
};
