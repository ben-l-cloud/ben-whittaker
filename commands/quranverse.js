module.exports = {
  name: "quranverse",
  description: "📖 Get a random inspiring verse from the Quran",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Loading message
    await sock.sendMessage(jid, {
      text: "🔎 Searching for a meaningful Quranic verse...",
      forwardingScore: 100,
      isForwarded: true,
    });

    // Sample verses (can be extended or fetched dynamically)
    const verses = [
      {
        ayah: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
        translation: "And my success is not but through Allah.",
        reference: "Quran 11:88"
      },
      {
        ayah: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "Indeed, with hardship [will be] ease.",
        reference: "Quran 94:6"
      },
      {
        ayah: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
        translation: "Indeed, Allah is with the patient.",
        reference: "Quran 2:153"
      },
      {
        ayah: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translation: "Say, He is Allah, [who is] One.",
        reference: "Quran 112:1"
      }
    ];

    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    // Send verse with formatting
    await sock.sendMessage(jid, {
      text: `📖 *Quranic Verse*\n\n${randomVerse.ayah}\n\n🕊️ *Translation:* ${randomVerse.translation}\n\n📚 *Reference:* ${randomVerse.reference}`,
      footer: "Ben Whittaker Tech • Quranic Wisdom",
      forwardingScore: 999,
      isForwarded: true,
    });
  }
};
