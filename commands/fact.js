const emojis = ["📚", "🤓", "🧠"];
const facts = [
  "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.",
  "Octopuses have three hearts and blue blood.",
  "Bananas are berries, but strawberries are not.",
  "A group of flamingos is called a 'flamboyance'.",
  "The Eiffel Tower can be 15 cm taller during hot days due to metal expansion.",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomFact = () => facts[Math.floor(Math.random() * facts.length)];

module.exports = {
  name: "fact",
  description: "Send a random interesting fact",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    await sock.sendMessage(jid, { text: "⌛ Let me find an interesting fact for you..." });
    await new Promise(r => setTimeout(r, 1400));
    await sock.sendMessage(jid, { text: randomFact() });
  },
};
