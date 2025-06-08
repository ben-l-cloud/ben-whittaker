module.exports = {
  name: "countrycapital",
  async execute(sock, msg) {
    const country = msg.body.split(" ")[1]?.toLowerCase();
    const capitals = {
      kenya: "Nairobi", tanzania: "Dodoma", uganda: "Kampala", nigeria: "Abuja", egypt: "Cairo",
      india: "New Delhi", usa: "Washington, D.C.", uk: "London", japan: "Tokyo", brazil: "Brasília"
    };
    const capital = capitals[country];
    await sock.sendMessage(msg.from, {
      text: capital ? `🏙️ Capital of ${country.toUpperCase()} is *${capital}*.` : "❌ Country not found."
    });
  }
};
