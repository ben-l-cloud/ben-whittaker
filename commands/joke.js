const emojis = ["😂", "🤣", "😹"];
const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "Why don't programmers like nature? It has too many bugs.",
  "Why did the computer take a nap? It had too many tabs open!",
  "Why don’t elephants use computers? Because they're afraid of the mouse!",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomJoke = () => jokes[Math.floor(Math.random() * jokes.length)];

module.exports = {
  name: "joke",
  description: "Tell a random joke",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // React with random emoji
    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    // Send loading message
    await sock.sendMessage(jid, { text: "⌛ Fetching a joke for you..." });
    await new Promise(r => setTimeout(r, 1200)); // Wait 1.2 seconds
    // Send the joke
    await sock.sendMessage(jid, { text: randomJoke() });
  },
};
