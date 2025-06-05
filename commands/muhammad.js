// commands/muhammad.js
module.exports = {
  name: "muhammad",
  description: "Hadithi ya Mtume Muhammad (SAW) - Mwalimu wa Haki, Rehma na Uongozi wa Ulimwengu 🌟",
  category: "islamic",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // React with a star emoji 🌟 when command is triggered
    await sock.sendMessage(jid, {
      react: {
        text: "🌟",
        key: msg.key
      }
    });

    const text = `
*Hadithi ya Mtume Muhammad (SAW)*

Mtume Muhammad (SAW) ni mtume wa mwisho wa Allah, aliyeleta nuru ya kweli kwa wanadamu wote. Alizaliwa Makkah, katika familia ya heshima, na alikulia akiwa na tabia ya unyenyekevu, huruma na haki. 

Alipokea Wahyi ya kwanza katika Hira, na alianza kuhubiri kuhusu ibada ya Mungu mmoja, adabu, haki za binadamu, na maadili mema. Mtume Muhammad (SAW) alikumbana na vikwazo vikubwa, ukandamizaji na mateso kutoka kwa watu wa Makkah, lakini hakukatishwa tamaa. 

Alisisitiza upendo, msamaha na kuishi kwa amani kati ya watu. Aliongoza kwa mfano bora, akiwa mkarimu, mkaribifu na mwenye haki. Kwa mfano wake, maelfu ya watu walirejea kwenye njia ya haki, wakakumbatia Uislamu.

Mtume Muhammad (SAW) aliwataka watu kuwaheshimu wenzake, kuwasaidia maskini, na kuishi kwa heshima na ustaarabu. Alisisitiza umuhimu wa kusamehe, kuvumilia, na kuungana katika umoja.

*Maana:* Tunaelewa kuwa imani na maadili mema yana nguvu ya kubadilisha dunia, na uongozi bora huleta amani.

*Amri:* Fuata mfano wa Mtume Muhammad (SAW) kwa kuishi kwa huruma, haki, na kueneza amani duniani.

🕋🤲🌙
    `;

    await sock.sendMessage(jid, { text });
  }
};
