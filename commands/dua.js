// commands/dua.js
module.exports = {
  name: "dua",
  description: "📿 Get a random Islamic dua",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Send loading message
    await sock.sendMessage(jid, {
      text: "🕋 *Searching for a beautiful dua...*",
      forwardingScore: 100,
      isForwarded: true,
    });

    // Random dua list
    const duas = [
      "اللّهُمَّ إنِّي أَسْأَلُكَ العَفْوَ وَالعَافِيَةَ",
      "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ",
      "اللّهُمَّ اهْدِنَا فِيمَنْ هَدَيْتَ",
      "اللّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ وَعَمَلٍ",
      "اللّهُمَّ بَارِكْ لَنَا فِي يَوْمِنَا وَارْزُقْنَا رِزْقًا طَيِّبًا"
    ];

    const randomDua = duas[Math.floor(Math.random() * duas.length)];

    await sock.sendMessage(jid, {
      text: `🤲 *Random Dua*\n\n${randomDua}`,
      footer: "Ben Whittaker Tech • Islamic Module",
      forwardingScore: 999,
      isForwarded: true,
    });
  }
};
