// commands/eidgreetings.js
module.exports = {
  name: "eidgreetings",
  description: "🌙 Send beautiful Eid greetings messages",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      text: "⏳ Preparing special Eid greetings for you...",
      forwardingScore: 100,
      isForwarded: true,
    });

    const greetings = [
      "Eid Mubarak! May Allah’s blessings light up your life and fill it with happiness.",
      "May the magic of Eid bring lots of happiness and love to you and your family. Eid Mubarak!",
      "Wishing you a joyous Eid filled with peace, happiness, and prosperity.",
      "On this holy day of Eid, may Allah accept your good deeds and forgive your sins. Eid Mubarak!",
      "May the spirit of Eid bring you closer to your loved ones and fill your heart with joy."
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    await sock.sendMessage(jid, {
      text: `✨ *Eid Greetings*\n\n${randomGreeting}`,
      footer: "Ben Whittaker Tech • Eid Greetings",
      forwardingScore: 999,
      isForwarded: true,
    });
  }
};
