module.exports = {
  name: "kick",
  description: "Tuma kick GIF/video na utake mtu aondoke group kwa reply au mention",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");

    const mediaDb = require("../media/media.json");
    const kickData = mediaDb.kick;
    if (!kickData) {
      return await sock.sendMessage(from, { text: "Kick video haipatikani." }, { quoted: msg });
    }

    // Pata target: mtu aliye reply au mention
    let target = null;
    if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
      target = msg.message.extendedTextMessage.contextInfo.participant;
    } else if (args.length) {
      // Kama kuna mention kwenye args (kwanza arg ni namba)
      target = args[0].includes("@") ? args[0] : args[0] + "@s.whatsapp.net";
    }

    if (!target) {
      return await sock.sendMessage(from, { text: "❌ Tafadhali reply au tag mtu unayetaka kumkick." }, { quoted: msg });
    }

    // Tuma video na caption ikiwa na mention ya target
    await sock.sendMessage(
      from,
      {
        video: { url: kickData.url },
        caption: `${kickData.caption || "Kick!"}\n\n@${target.split("@")[0]} umekickwa!`,
        mentions: [target],
        gifPlayback: true,
      },
      { quoted: msg }
    );

    // Kama ni group, jaribu kumtoa mtu kutoka group (kick)
    if (isGroup) {
      try {
        await sock.groupRemove(from, [target]);
        await sock.sendMessage(from, { text: `✅ Mtu @${target.split("@")[0]} ameondolewa kwenye group.` }, { mentions: [target] });
      } catch (e) {
        await sock.sendMessage(from, { text: `⚠️ Kumtoa mtu kwenye group kumeshindikana: ${e.message}` });
      }
    }
  },
};
