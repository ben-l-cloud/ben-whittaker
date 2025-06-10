const fs = require("fs");

module.exports = {
  name: "help",
  description: "🆘 Show help message with image",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;

    // Load your cyber.png image from your local folder
    const imageBuffer = fs.readFileSync("./cyber.png"); // make sure cyber.png is in the same folder

    const helpText = `🆘 *Help Menu*\n
Commands:
- !hello 👋
- !ping 🏓
- !joke 🤣
- !quote 💡
- !8ball 🎱
- !fact 📚
- !echo 🗣️
- !userinfo 👤
- !avatar 🖼️
- !groupinfo 👥
- !roll 🎲
- !laugh 😂
- !goodbye 👋
...and more!`;

    // Send the image with caption
    const sent = await sock.sendMessage(from, {
      image: imageBuffer,
      caption: helpText,
    }, { quoted: msg });

    // React with emoji to the sent message
    await sock.sendMessage(from, {
      react: {
        text: "🆘",
        key: sent.key,
      },
    });
  },
};
