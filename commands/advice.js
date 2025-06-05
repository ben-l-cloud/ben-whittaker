const emojis = ["🗣️", "💡", "🤔"];
const advices = [
  "Never give up, your success is near.",
  "Every problem is a chance to learn.",
  "Work hard and good results will follow.",
  "Listen more, speak less.",
  "Be patient, everything happens in its own time.",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomAdvice = () => advices[Math.floor(Math.random() * advices.length)];

module.exports = {
  name: "advice",
  description: "Send a random advice",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    await sock.sendMessage(jid, { text: "⌛ Getting some advice for you..." });
    await new Promise(r => setTimeout(r, 1100));
    await sock.sendMessage(jid, { text: randomAdvice() });
  },
};
