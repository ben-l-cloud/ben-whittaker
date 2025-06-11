const fs = require("fs-extra");
const os = require("os");
const moment = require("moment-timezone");
const { format } = require(__dirname + "/../framework/mesfonctions");
const s = require(__dirname + "/../set");
const { cm } = require(__dirname + "/../framework/zokou");

module.exports = {
  nomCom: "menu2",
  categorie: "General",
  reaction: "📜",

  desc: "Onyesha orodha ya amri zote za bot",
  
  async execute(dest, zk, commandeOptions) {
    let { ms, repondre } = commandeOptions;
    var coms = {};
    var mode = (s.MODE || "").toLowerCase() === "yes" ? "public" : "private";

    // Pangilia commands kulingana na category
    cm.map((com) => {
      if (!coms[com.categorie]) coms[com.categorie] = [];
      coms[com.categorie].push(com.nomCom);
    });

    // Tarehe na saa
    moment.tz.setDefault('Etc/GMT');
    const date = moment().format('DD/MM/YYYY');

    // Maelezo ya juu ya menu
    let infoMsg = `
╭────《CYBER-MD 💻 BOT》────
┴  ╭─────────────
│❒ *ADMIN* : ${s.OWNER_NAME}
│❒ *CALENDAR* : ${date}
│❒ *PREFIX* : ${s.PREFIXE}
│❒ *BOT IS IN* : ${mode} mode
│❒ *ORDERS* : ${cm.length} 
│❒ *SPACE* : ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
│❒ *PLATFORM* : ${os.platform()}
│❒ *THEME* : *CYBER-MD 💻*
┬  ╰──────────────
╰─── ··《CYBER-MD 💻》··──\n`;

    // Orodha ya commands
    let menuMsg = `
─────────
  *💻 CYBER-MD WHATSAPP BOT 💻* 
─────────

 *📜 COMMANDS*
`;

    for (const cat in coms) {
      menuMsg += ` ╭─⬡ *${cat.toUpperCase()}* ⬡─`;
      for (const cmd of coms[cat]) {
        menuMsg += `\n⬡│▸ *${cmd}*`;
      }
      menuMsg += `\n  ╰────────────·· \n`;
    }

    menuMsg += `
|⏣ POWERED BY CYBER TECH 💻
*❒⁠⁠⁠⁠———————— ❒⁠⁠⁠⁠——————❒⁠⁠⁠⁠*
`;

    // Soma picha ya cyber.png
    try {
      const imageBuffer = fs.readFileSync("./cyber.png");

      await zk.sendMessage(dest, {
        image: imageBuffer,
        caption: infoMsg + menuMsg,
        footer: "Je suis *Cyber-MD*, développeur CYBER TECH"
      }, { quoted: ms });

    } catch (e) {
      console.error("🥵🥵 Menu erreur " + e);
      repondre("🥵🥵 Menu erreur " + e.message);
    }
  }
};
