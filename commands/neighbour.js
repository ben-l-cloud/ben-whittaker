module.exports = {
  name: "neighbour",
  async execute(sock, msg) {
    const country = msg.body.split(" ")[1]?.toLowerCase();
    const data = {
      tanzania: ["Kenya", "Uganda", "Rwanda", "Burundi", "Mozambique", "Zambia", "Malawi", "DR Congo"],
      kenya: ["Tanzania", "Uganda", "South Sudan", "Ethiopia", "Somalia"]
    };
    const result = data[country]?.join(", ");
    await sock.sendMessage(msg.from, {
      text: result ? `🌐 Neighbours of ${country.toUpperCase()}:\n${result}` : "❌ Unknown country."
    });
  }
};
