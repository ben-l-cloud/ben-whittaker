const emojis = ["😜", "😈", "🤣"];
const insults = [
  "You’re as bright as a black hole, and twice as dense.",
  "If I wanted to kill myself, I’d climb your ego and jump to your IQ.",
  "You have something on your chin… no, the third one down.",
  "You bring everyone so much joy… when you leave the room.",
  "You’re the reason the gene pool needs a lifeguard.",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomInsult = () => insults[Math.floor(Math.random() * insults.length)];

module.exports = {
  name: "insult",
  description: "Send a funny random insult",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    await sock.sendMessage(jid, { text: "⌛ Preparing a witty insult..." });
    await new Promise(r => setTimeout(r, 1100));
    await sock.sendMessage(jid, { text: randomInsult() });
  },
};
