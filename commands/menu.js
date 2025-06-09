const os = require("os");
const { performance } = require("perf_hooks");

module.exports = {
  name: "menu",
  description: "📜 Display all commands in style",
  category: "general",
  async execute(sock, msg, args, commands) {
    const jid = msg.key.remoteJid;
    const menuImage = "cyber.png";

    await sock.sendMessage(jid, { text: "🕐 *Loading Menu... Please wait...*" });

    const start = performance.now();
    const hostname = os.hostname();
    const platform = os.platform();
    const ramUsed = ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(1);
    const speed = (performance.now() - start).toFixed(2);
    const totalCommands = commands?.length || 250;

    const text = `
╭━━━〔 🤖 *CYBER-MS BOT MENU* 〕━━━◆
│ 
│ 🧠 *SYSTEM INFO*
│ ─────────────────────
│ 📦 Total Commands: *${totalCommands}*
│ 💻 Platform: *${platform}*
│ 🖥️ Hostname: *${hostname}*
│ ⚡ Speed: *${speed} ms*
│ 🧠 RAM Usage: *${ramUsed} MB*
│ 
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭──〔 🧰 TOOLS - 25 〕──────╮
│ !ai
│ !math
│ !translate
│ !qrcode
│ !tts
│ !voice
│ !weather
│ !timer
│ !clock
│ !calc
│ !note
│ !shorturl
│ !whois
│ !uuid
│ !hash
│ !text2img
│ !urlscan
│ !barcode
│ !define
│ !ocr
│ !readmore
│ !reminder
│ !image2text
│ !ipinfo
│ !ping
╰────────────────────────╯

╭──〔 👥 GROUP - 25 〕─────╮
│ !add
│ !kick
│ !promote
│ !demote
│ !tagall
│ !revoke
│ !grouplink
│ !mute
│ !unmute
│ !groupinfo
│ !admin
│ !leave
│ !setdesc
│ !setname
│ !welcome
│ !goodbye
│ !antilink
│ !antifake
│ !antiviewonce
│ !lock
│ !unlock
│ !block
│ !unblock
│ !warn
│ !rules
╰────────────────────────╯

╭──〔 🛡️ SECURITY - 25 〕────╮
│ !ban
│ !unban
│ !blocklist
│ !scanadmin
│ !checkadmin
│ !antispam
│ !antiviewonce
│ !antiswear
│ !report
│ !warnlist
│ !kickunknown
│ !groupstatus
│ !antiadmin
│ !safemode
│ !botguard
│ !hidecmd
│ !botstatus
│ !whitelist
│ !resetbot
│ !privatemode
│ !adminonly
│ !auditlog
│ !cleanbots
│ !securitystatus
│ !clearwarn
╰────────────────────────╯

╭──〔 🧰 UTILITIES - 25 〕────╮
│ !serverinfo
│ !uptime
│ !ping
│ !speedtest
│ !status
│ !iplookup
│ !checktime
│ !timezone
│ !webinfo
│ !urltitle
│ !dnslookup
│ !jsonformat
│ !log
│ !convert
│ !base64
│ !hex
│ !binary
│ !bmi
│ !agecalc
│ !emailcheck
│ !httpcheck
│ !sysinfo
│ !storage
│ !calendar
│ !reminder
╰────────────────────────╯

╭──〔 📚 EDUCATION -
│ !dictionary
│ !thesaurus
│ !grammar
│ !periodic
│ !element
│ !mathsolve
│ !unitconvert
│ !equation
│ !wikipedia
│ !encyclopedia
│ !historytoday
│ !sciencefact
│ !readbook
│ !story
│ !timeline
│ !nobel
│ !inventor
│ !synonym
│ !antonym
│ !quiz
│ !test
│ !exam
│ !university
│ !degree
│ !career
╰────────────────────────╯

╭──〔 🎖️ MILITARY - 25 〕────╮
│ !armynews
│ !weapons
│ !rank
│ !strategy
│ !warhistory
│ !militarytime
│ !troops
│ !forcecalc
│ !intel
│ !missions
│ !sniper
│ !airstrike
│ !tank
│ !navy
│ !marine
│ !defense
│ !radar
│ !attackplan
│ !drone
│ !airforce
│ !militarybase
│ !camouflage
│ !commander
│ !codeblack
│ !survival
╰────────────────────────╯

🖼️ Sending with banner image...
`;

    await sock.sendMessage(jid, {
      image: { url: menuImage },
      caption: text,
      footer: "CYBER-MS BOT 💻",
      buttons: [
        { buttonId: "owner", buttonText: { displayText: "👑 Owner" }, type: 1 },
        { buttonId: "support", buttonText: { displayText: "💬 Support" }, type: 1 },
        { buttonId: "rules", buttonText: { displayText: "📜 Rules" }, type: 1 }
      ],
      headerType: 4,
    });
  },
};
