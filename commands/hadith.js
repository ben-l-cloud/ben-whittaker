module.exports = {
  name: "hadith",
  description: "📜 Get a random Hadith with source and grading",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      text: "📖 Retrieving a beneficial Hadith...",
      forwardingScore: 100,
      isForwarded: true,
    });

    const hadiths = [
      {
        text: "The best among you are those who have the best manners and character.",
        source: "Sahih Bukhari 3559",
        grade: "Sahih"
      },
      {
        text: "Actions are judged by intentions.",
        source: "Sahih Bukhari & Muslim",
        grade: "Sahih"
      },
      {
        text: "None of you truly believes until he wishes for his brother what he wishes for himself.",
        source: "Sahih Bukhari & Muslim",
        grade: "Sahih"
      },
      // Add more hadiths here
    ];

    const hadith = hadiths[Math.floor(Math.random() * hadiths.length)];

    const message = 
      `🕌 *Hadith*\n\n` +
      `📜 ${hadith.text}\n\n` +
      `*Source:* ${hadith.source}\n` +
      `*Grade:* ${hadith.grade}\n\n` +
      `_© Ben Whittaker Tech_`;

    await sock.sendMessage(jid, { text: message });
  }
};
