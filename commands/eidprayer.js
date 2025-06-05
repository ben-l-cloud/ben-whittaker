// commands/eidprayer.js
module.exports = {
  name: "eidprayer",
  description: "🕋 Special prayers for Eid",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      text: "🙏 Sending heartfelt Eid prayers...",
      forwardingScore: 100,
      isForwarded: true,
    });

    const prayer = `
اللَّهُمَّ اجْعَلْنَا مِنْ أَهْلِ الْفِدْيَةِ وَالْفِدْيَةِ
اللَّهُمَّ اجْعَلْنَا مِنْ عِبَادِكَ الصَّالِحِينَ
اللَّهُمَّ تَقَبَّلْ مِنَّا صِيَامَنَا وَقِيَامَنَا
اللَّهُمَّ اجْعَلْنَا مِنَ الْمُتَقِينَ

(Allahumma aj’alna min ahlil fidiya wal fidiya,
Allahumma aj’alna min ‘ibadikas-salihin,
Allahumma taqabbal minna siyamana wa qiyamana,
Allahumma aj’alna minal muttaqin)

*Maana:*  
Ya Allah, utufanye miongoni mwa waliofanikiwa, miongoni mwa watumishi wako wema. Utukubalie kuomba kwetu na ibada zetu. Utufanye miongoni mwa watakao ogopa (kutii) kwako.

Eid Mubarak!
    `;

    await sock.sendMessage(jid, {
      text: prayer,
      footer: "Ben Whittaker Tech • Eid Prayers",
      forwardingScore: 999,
      isForwarded: true,
    });
  }
};
