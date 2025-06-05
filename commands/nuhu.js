// commands/nuhu.js
module.exports = {
  name: "nuhu",
  description: "Hadithi ya Nuhu (A.S) - Subira na kujenga imani mbele ya majaribu.",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const text = `
*Hadithi ya Nuhu (A.S)*

Nuhu alikuwa mtume aliyeamriwa kuonyesha watu njia ya kuishi kwa haki na subira. Alijenga safina kwa amri ya Allah, akawahimiza watu kuondoka katika dhambi kabla ya mafuriko makubwa yaliyoja.

*Maana:* Jifunze kuwa na subira na usikate tamaa hata ukiwa peke yako.

*Amri:* Jenga imani yako kwa vitendo vyema na kuishi kwa hofu ya Allah.
    `;

    await sock.sendMessage(jid, { text });
  }
};
