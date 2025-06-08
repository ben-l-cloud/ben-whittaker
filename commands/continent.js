module.exports = {
  name: "continent",
  async execute(sock, msg) {
    const country = msg.body.split(" ")[1]?.toLowerCase();
    const map = {
      tanzania: "Africa", kenya: "Africa", egypt: "Africa", brazil: "South America",
      japan: "Asia", usa: "North America", australia: "Australia", france: "Europe"
    };
    await sock.sendMessage(msg.from, {
      text: map[country] ? `🌍 ${country.toUpperCase()} is in *${map[country]}*.` : "❌ Unknown country."
    });
  }
};
