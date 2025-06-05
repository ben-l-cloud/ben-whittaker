const emojis = ["😍", "😘", "💘"];
const pickupLines = [
  "Are you a magician? Because whenever I look at you, everyone else disappears!",
  "Do you have a map? I keep getting lost in your eyes.",
  "Are you French? Because Eiffel for you.",
  "Is your name Google? Because you have everything I’ve been searching for.",
  "Are you a camera? Because every time I look at you, I smile.",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomPickup = () => pickupLines[Math.floor(Math.random() * pickupLines.length)];

module.exports = {
  name: "pickup",
  description: "Send a random pickup line",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    await sock.sendMessage(jid, { text: "⌛ Searching for a smooth pickup line..." });
    await new Promise(r => setTimeout(r, 1200));
    await sock.sendMessage(jid, { text: randomPickup() });
  },
};
