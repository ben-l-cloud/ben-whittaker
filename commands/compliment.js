const emojis = ["🌟", "✨", "💖"];
const compliments = [
  "You have a wonderful smile!",
  "You are very smart and talented!",
  "Everything you do is amazing!",
  "You did a great job today!",
  "You are someone to look up to!",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomCompliment = () => compliments[Math.floor(Math.random() * compliments.length)];

module.exports = {
  name: "compliment",
  description: "Send a random compliment",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    await sock.sendMessage(jid, { text: "⌛ Fetching a compliment..." });
    await new Promise(r => setTimeout(r, 1000));
    await sock.sendMessage(jid, { text: randomCompliment() });
  },
};
