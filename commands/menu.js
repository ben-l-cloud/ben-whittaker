const os = require("os");
const { performance } = require("perf_hooks");

module.exports = {
  name: "menu",
  description: "📜 Display all commands in style",
  category: "general",
  async execute(sock, msg, args, commands) {
    const jid = msg.key.remoteJid;
    const menuImage = "cyber-md.png";

    await sock.sendMessage(jid, { text: "🕐 *Loading Menu... Please wait...*" });

    const start = performance.now();
    const hostname = os.hostname();
    const platform = os.platform();
    const ramUsed = ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(1);
    const speed = (performance.now() - start).toFixed(2);
    const totalCommands = commands?.length || 250;

    const text = `
╭━━━〔 🤖 *CYBER-MD BOT MENU* 〕━━━◆
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

╭──〔 📚 EDUCATION - 25 〕───╮
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

╭──〔 📷 IMAGE TOOLS - 25 〕───╮
│ !toimage
│ !removebg
│ !blur
│ !rotate
│ !mirror
│ !invert
│ !resize
│ !contrast
│ !brightness
│ !threshold
│ !grayscale
│ !pixelate
│ !sepia
│ !sketch
│ !colorize
│ !deepfry
│ !jpegify
│ !sharpen
│ !cartoon
│ !triggered
│ !wasted
│ !blurface
│ !invertcolors
│ !shred
│ !glitch
╰────────────────────────╯

╭──〔 🧠 AI FEATURES - 25 〕────╮
│ !chatgpt
│ !bard
│ !copilot
│ !dalle
│ !imagine
│ !aimage
│ !aivoice
│ !astory
│ !acode
│ !translateai
│ !askai
│ !aijoke
│ !aifacts
│ !ainews
│ !aibible
│ !ailyrics
│ !aiplan
│ !aisummary
│ !aimeme
│ !aivideo
│ !aiquote
│ !gpt4
│ !aicartoon
│ !aisticker
│ !aigame
╰────────────────────────╯

╭──〔 🛰️ HACK TOOLS - 25 〕────╮
│ !iplookup
│ !binlookup
│ !ccgen
│ !cccheck
│ !phoneinfo
│ !deviceinfo
│ !nmap
│ !whois
│ !dnsdump
│ !subfinder
│ !urlscan
│ !getheaders
│ !reverseip
│ !emailverify
│ !portscan
│ !proxycheck
│ !maclookup
│ !htmlgrab
│ !phishdetect
│ !linkgrab
│ !geolocate
│ !bugscan
│ !sqlinject
│ !dorker
│ !botnet
╰────────────────────────╯

╭──〔 🎮 GAMES & FUN - 25 〕────╮
│ !truth
│ !dare
│ !tictactoe
│ !guessnumber
│ !rps
│ !spin
│ !slots
│ !quiz
│ !trivia
│ !mathquiz
│ !coinflip
│ !8ball
│ !couplematch
│ !joke
│ !memegen
│ !roast
│ !fact
│ !truthordare
│ !hotcold
│ !animalgame
│ !lovepercent
│ !shipname
│ !meme
│ !simprate
│ !gayrate
╰────────────────────────╯

╭──〔 🕌 ISLAMIC - 25 〕───────╮
│ !quran
│ !surah
│ !ayah
│ !tafseer
│ !azan
│ !hadith
│ !prophet
│ !kalima
│ !prayer
│ !dua
│ !islamquote
│ !ramadan
│ !hijridate
│ !muslimname
│ !namaz
│ !zakah
│ !fasting
│ !hajj
│ !umrah
│ !adhanmp3
│ !bukhari
│ !muslim
│ !qibla
│ !prophethistory
│ !islamicfacts
╰────────────────────────╯
╭──〔 🔬 SCIENCE - 15 〕─────╮
│ !periodictable
│ !element Oxygen
│ !nasaimage
│ !spacexnews
│ !blackhole
│ !quantumfacts
│ !neutronstar
│ !physicsfact
│ !chemistryfact
│ !biotech
│ !genetics
│ !climatechange
│ !atommodel
│ !exoplanet
│ !earthrotation
╰─────────────────────────╯
╭──〔 💼 BUSINESS - 10 〕────╮
│ !stockprice Tesla
│ !cryptoprice BTC
│ !marketnews
│ !businessquote
│ !startuptips
│ !forexrate USD
│ !trendingstocks
│ !investmenttip
│ !entrepreneurfact
│ !economicterm GDP
╰─────────────────────────╯
╭──〔 🌍 GEOGRAPHY - 10 〕───╮
│ !countryinfo Kenya
│ !capital Tanzania
│ !continent Africa
│ !flag Ghana
│ !map Nigeria
│ !timezone Japan
│ !currency India
│ !area Brazil
│ !population China
│ !neighbours Uganda
╰─────────────────────────╯
╔══════════════════════╗
║  🤖 GENERAL COMMANDS 🤖  ║
╠══════════════════════╣
║ 1. !help             ║
║ 2. !ping             ║
║ 3. !about            ║
║ 4. !owner            ║
║ 5. !stats            ║
║ 6. !menu             ║
║ 7. !info             ║
║ 8. !feedback         ║
║ 9. !report           ║
║ 10.!uptime           ║
╚══════════════════════╝
🖼️ Sending with banner image...
`;

    await sock.sendMessage(jid, {
      image: { url: menuImage },
      caption: text,
      footer: "CYBER-MD BOT 💻",
      buttons: [
        { buttonId: "owner", buttonText: { displayText: "👑 Owner" }, type: 1 },
        { buttonId: "support", buttonText: { displayText: "💬 Support" }, type: 1 },
        { buttonId: "rules", buttonText: { displayText: "📜 Rules" }, type: 1 }
      ],
      headerType: 4,
    });
  },
};
