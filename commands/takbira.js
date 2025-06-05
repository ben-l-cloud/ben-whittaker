// commands/takbira.js
module.exports = {
  name: "takbira",
  description: "📢 Takbira za Eid al-Fitr na Eid al-Adha (Takbira Tulihiram)",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Loading message
    await sock.sendMessage(jid, {
      text: "📢 Inakuletea Takbira Tulihiram za Eid...",
      forwardingScore: 100,
      isForwarded: true,
    });

    const takbira = `
*Takbira Tulihiram (Takbirat al-Eid)*

اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ
اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ
لَا إِلٰهَ إِلَّا اللَّهُ
وَاللَّهُ أَكْبَرُ
اللَّهُ أَكْبَرُ
وَلِلَّهِ الْحَمْدُ

(Allah Akbar, Allah Akbar,
La ilaha illa Allah,
Wallahu Akbar, Allahu Akbar,
Wa lillahil hamd)

*Maana:*
Allah ni Mkuu, Allah ni Mkuu,
Hakuna mungu isipokuwa Allah,
Allah ni Mkuu, Allah ni Mkuu,
Na kwa Allah pendo lote.

---

*Tunapenda kushiriki baraka na furaha za Eid! Eid Mubarak!*
    `;

    await sock.sendMessage(jid, {
      text: takbira,
      footer: "Ben Whittaker Tech • Takbira Tulihiram",
      forwardingScore: 999,
      isForwarded: true,
    });
  }
};
