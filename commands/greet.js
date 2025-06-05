const emojis = ["👋", "😊", "🙌"];
const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

const greetings = [
  "Hello! How can I help you today?",
  "Hi there! What's up?",
  "Hey! Hope you're having a great day!",
];

module.exports = {
  name: "greet",
  description: "Send greeting message",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, {
      react: { text: randomEmoji(), key: msg.key }
    });

    await sock.sendMessage(jid, { text: "⌛ Sending greeting..." });

    await new Promise(r => setTimeout(r, 800));

    const greetMsg = greetings[Math.floor(Math.random() * greetings.length)];

    await sock.sendMessage(jid, { text: greetMsg });
  },
};
