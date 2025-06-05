// commands/ismail.js
module.exports = {
  name: "ismail",
  description: "Hadithi ya Ismail (A.S) - Utii kwa amri za baba na Allah.",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const text = `
*Hadithi ya Ismail (A.S)*

Ismail alikuwa mtu wa utii mkubwa kwa baba yake Ibrahimu na kwa amri za Allah. Alijiandaa kufanywa dhabihu bila kujibizana.

*Maana:* Utii na kujiweka tayari kwa majaribu kwa imani kubwa.

*Amri:* Kuwa tayari kufuata amri za haki kwa moyo mkunjufu.
    `;

    await sock.sendMessage(jid, { text });
  }
};
