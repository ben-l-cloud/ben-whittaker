

const axios = require("axios");

module.exports = {
  name: "ai",
  description: "🤖 Jibu la AI",
  async execute(sock, msg, args) {
    const input = args.join(" ");
    if (!input) {
      return await sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Andika swali. Mfano: !ai what is technology?" },
        { quoted: msg }
      );
    }

    try {
      const response = await axios.get(`https://api.mandeepapi.xyz/api/ai`, {
        params: {
          text: input,
          apikey: "01ba6e2181057b3e2156db7beda4dc1654cd48a27b4b333c2131f9c2d06e0073"
        }
      });

      const reply = response.data.result || "⚠️ Samahani, AI haikupata jibu.";
      await sock.sendMessage(
        msg.key.remoteJid,
        {
          text: `🤖 *AI says:*\n${reply}`,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 500,
            externalAdReply: {
              title: "AI Response - Ben Whittaker Tech",
              body: "Powered by mandeepapi",
              mediaType: 1,
              renderLargerThumbnail: true,
              thumbnailUrl: "https://avatars.githubusercontent.com/u/16713457", // optional
              sourceUrl: " https://github.com/ben-l-cloud/ben-whittaker.git "
            }
          }
        },
        { quoted: msg }
      );
    } catch (err) {
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ AI Error: Samahani, jaribu tena baadae." },
        { quoted: msg }
      );
