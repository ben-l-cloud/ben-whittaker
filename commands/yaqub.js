// commands/yaqub.js
module.exports = {
  name: "yaqub",
  description: "Hadithi ya Yaqub (A.S) - Subira katika majaribu na imani.",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const text = `
*Hadithi ya Yaqub (A.S)*

Yaqub alikumbwa na majaribu mengi lakini akavumilia kwa subira na kuendelea kuamini Allah bila kukata tamaa.

*Maana:* Imara kwa imani hata wakati wa majaribu.

*Amri:* Vumilia majaribu yako kwa subira na uendelee kumtegemea Allah.
    `;

    await sock.sendMessage(jid, { text });
  }
};
