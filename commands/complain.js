const emojis = ["😤", "😒", "😡"];
const complaints = [
  "Why is it so hard to find a pen when you really need one?",
  "The elevator never comes when you’re in a hurry.",
  "Why do socks always disappear in the laundry?",
  "Coffee is always too hot or too cold, never just right.",
  "Why do meetings never start on time?",
];

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const randomComplaint = () => complaints[Math.floor(Math.random() * complaints.length)];

module.exports = {
  name: "complain",
  description: "Send a random funny complaint",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, { react: { text: randomEmoji(), key: msg.key } });
    await sock.sendMessage(jid, { text: "⌛ Venting a little..." });
    await new Promise(r => setTimeout(r, 1000));
    await sock.sendMessage(jid, { text: randomComplaint() });
  },
};
