module.exports = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    const text = msg.message.conversation || "";
    if (text.toLowerCase() === "!help") {
      await sock.sendMessage(msg.key.remoteJid, { text: "🛠️ Help Menu\n!menu\n!info\n!status" }, { quoted: msg });
    }
  });
};