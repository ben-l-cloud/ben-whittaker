const emojis = ["😂", "🤣", "😹"];
const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "Why don't programmers like nature? Too many bugs.",
];

module.exports = {
  name: "joke",
  description: "Tell a joke",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, {
      react: { text: randomEmoji(), key: msg.key }
    });

    await sock.sendMessage(jid, { text: "⌛ Fetching a joke..." });

    await new Promise(r => setTimeout(r, 1000));

    const joke = jokes[Math.floor(Math.random() * jokes.length)];

    await sock.sendMessage(jid, { text: joke });
  },
};
