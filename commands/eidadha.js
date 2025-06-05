// commands/eidadha.js
module.exports = {
  name: "eidadha",
  description: "🕌 Info kuhusu Eid al-Adha - historia, maana, na du'a",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Loading message
    await sock.sendMessage(jid, {
      text: "🌙 Tunakupeleka kwenye habari na du'a za Eid al-Adha...",
      forwardingScore: 100,
      isForwarded: true,
    });

    const message = `
🕌 *Eid al-Adha* (Eid Adha) ni Sikukuu Kuu ya Kiislamu inayoadhimishwa kuwakumbuka ibada ya Ibrahimu (A.S) kwa kujaribu imani yake kwa Allah.

📅 Sikukuu hii huadhimishwa tarehe 10 ya mwezi wa Dul-Hijjah (mwezi wa mwisho wa mwaka wa Kiislamu).

🐑 Inahusiana na hadhi ya kuruhusiwa kutoa dhabihu ya wanyama kama kondoo, ng'ombe au ngamia kama sehemu ya sadaka kwa Allah, kama alivyotenda Ibrahimu.

✨ *Maana:* Eid al-Adha ni “Sikukuu ya Sadaka,” ambapo waislamu hutoa sadaka kwa maskini, familia na jamii.

📜 *Du'a za Eid al-Adha:*

اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ

(Allahumma taqabbal minna innaka anta as-sami'ul 'alim)

*Maana:* Ee Allah, tukubalie sadaka zetu, hakika Wewe ndiye Mkusikaji na Mjuzi.

🕋 *Eid Mubarak!*
    `;

    await sock.sendMessage(jid, {
      text: message,
      footer: "Ben Whittaker Tech • Eid al-Adha Info",
      forwardingScore: 999,
      isForwarded: true,
    });
  }
};
