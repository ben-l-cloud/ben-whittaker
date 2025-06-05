const emojis = ["🔮", "✨", "🌠"];
const fortunes = [
  "You will have a pleasant surprise soon.",
  "A new opportunity is on the horizon.",
  "Be patient; good things take time.",
  "Your hard work will soon pay off.",
  "Someone close to you has good news.",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomFortune = () => fortunes[Math.floor(Math.random() * fortunes.length)];

module.exports = {
  name: "fortune",
  description: "Give a random fortune",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    await sock.sendMessage(jid, { text: "⌛ Consulting the stars..." });
    await new Promise(r => setTimeout(r, 1300));
    await sock.sendMessage(jid, { text: randomFortune() });
  },
};
