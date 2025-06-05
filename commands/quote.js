const emojis = ["💬", "📝", "✍️"];
const quotes = [
  "Don't wait for opportunity. Create it. — Unknown",
  "Every day is a new chance to change your life. — Unknown",
  "Success doesn’t come to you, you go to it. — Marva Collins",
  "Dream big and dare to fail. — Norman Vaughan",
  "Failure is the condiment that gives success its flavor. — Truman Capote",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

module.exports = {
  name: "quote",
  description: "Send a random motivational quote",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    await sock.sendMessage(jid, { text: "⌛ Searching for an inspiring quote..." });
    await new Promise(r => setTimeout(r, 1200));
    await sock.sendMessage(jid, { text: randomQuote() });
  },
};
