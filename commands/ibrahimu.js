// commands/ibrahimu.js
module.exports = {
  name: "ibrahimu",
  description: "Hadithi ya Ibrahimu (A.S) - Ushujaa wa kuabudu Mungu mmoja.",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const text = `
*Hadithi ya Ibrahimu (A.S)*

Ibrahimu alikataa ibada ya sanamu na kutangaza ibada kwa Mungu mmoja. Alikabiliana na majaribu makubwa kwa ushujaa na imani isiyoyumba.

*Maana:* Kuwa jasiri na imani thabiti katika kusimama kwa kweli.

*Amri:* Dharau mabishano ya dunia na imani kwa moyo wote.
    `;

    await sock.sendMessage(jid, { text });
  }
};
