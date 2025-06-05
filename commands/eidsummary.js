// commands/eidsummary.js
module.exports = {
  name: "eidsummary",
  description: "📖 Summary and significance of Eid",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      text: "📚 Gathering Eid knowledge...",
      forwardingScore: 100,
      isForwarded: true,
    });

    const summary = `
*Eid-ul-Fitr and Eid-ul-Adha* are two major Islamic festivals celebrated worldwide.

- *Eid-ul-Fitr* marks the end of Ramadan, the holy month of fasting.
- *Eid-ul-Adha* commemorates the willingness of Prophet Ibrahim (A.S) to sacrifice his son in obedience to Allah.

Both days are occasions for prayer, charity, family gatherings, and joy.

May Allah accept our fasting, prayers, and sacrifices. Eid Mubarak!
    `;

    await sock.sendMessage(jid, {
      text: summary,
      footer: "Ben Whittaker Tech • Eid Summary",
      forwardingScore: 999,
      isForwarded: true,
    });
  }
};
