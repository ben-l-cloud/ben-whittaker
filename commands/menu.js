const fs = require("fs");
const os = require("os");
const moment = require("moment");

module.exports = {
  nomCom: "menu",
  categorie: "General",
  reaction: "📜",
  desc: "Onyesha menu kuu ya bot",

  async execute(dest, zk, commandeOptions) {
    const { ms, repondre } = commandeOptions;

    // Tarehe & saa
    moment.tz.setDefault("Africa/Nairobi");
    const date = moment().format("DD/MM/YYYY");
    const time = moment().format("HH:mm:ss");

    // Set admin name, prefix, mode manually
    const ADMIN_NAME = "CYBER";
    const PREFIX = "😁";
    const MODE = "private";

    // Orodha ya commands zako kwa mfano
    const commands = [
      { name: "menu", category: "General" },
      { name: "ping", category: "General" },
      { name: "sticker", category: "Media" },
      { name: "ai", category: "AI" },
      { name: "img", category: "AI" },
      { name: "owner", category: "Admin" },
      // ongeza zingine hapa...
    ];

    // Pangilia commands kwa category
    const groupedCommands = {};
    for (const cmd of commands) {
      if (!groupedCommands[cmd.category]) {
        groupedCommands[cmd.category] = [];
      }
      groupedCommands[cmd.category].push(cmd.name);
    }

    // Info ya juu
    let infoMsg = `
╭────《CYBER-MD 💻》────
│❒ ADMIN: ${ADMIN_NAME}
│❒ DATE: ${date}
│❒ TIME: ${time}
│❒ PREFIX: ${PREFIX}
│❒ MODE: ${MODE}
│❒ COMMANDS: ${commands.length}
│❒ SPACE: ${(os.totalmem() - os.freemem()) / 1024 / 1024}MB free
│❒ SYSTEM: ${os.platform()}
╰───────────────────────\n`;

    // Command menu
    let menuMsg = `🧠 *CYBER-MD MAIN MENU*\n\n`;

    for (const category in groupedCommands) {
      menuMsg += `╭─── ${category.toUpperCase()} ───╮\n`;
      for (const cmdName of groupedCommands[category]) {
        menuMsg += `│ ➤ ${PREFIX}${cmdName}\n`;
      }
      menuMsg += `╰─────────────────╯\n\n`;
    }

    // Tuma image kama caption
    try {
      const imageBuffer = fs.readFileSync("./cyber.png");
      await zk.sendMessage(dest, {
        image: imageBuffer,
        caption: infoMsg + menuMsg,
        footer: "🤖 CYBER-MD Bot | Made with ❤️"
      }, { quoted: ms });

    } catch (error) {
      console.error("Menu error:", error);
      repondre("🥵 Imeshindikana kutuma menu: " + error.message);
    }
  }
};
