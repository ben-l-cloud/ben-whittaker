// ✅ BEN WHITTAKER TECH - WhatsApp Bot (index.js)
const express = require("express");
const fs = require("fs");
const path = require("path");
const P = require("pino");
const axios = require("axios");
const cheerio = require("cheerio");
const { Boom } = require("@hapi/boom");
const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  downloadContentFromMessage
} = require("@whiskeysockets/baileys");

// ✅ Express Web Server
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("🤖 BEN WHITTAKER TECH BOT is running!"));
app.listen(PORT, () => console.log(`✅ Express running on port ${PORT}`));

// ⚙️ BOT SETTINGS
const OWNER_JID = "255654478605@s.whatsapp.net";
const PREFIX = "😁";
const antiLinkGroups = {};
const emojiReactions = ["❤️", "😂", "🔥", "👍", "😎", "🤖"];
const randomEmoji = () => emojiReactions[Math.floor(Math.random() * emojiReactions.length)];

// Load Media DB
let mediaDb = {};
try {
  if (fs.existsSync("./media/media.json")) {
    mediaDb = JSON.parse(fs.readFileSync("./media/media.json", "utf-8"));
  } else {
    console.warn("⚠️ media.json not found.");
  }
} catch (err) {
  console.error("❌ Error loading media.json:", err);
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
    },
    logger: P({ level: "silent" })
  });

  // 🔁 Auto Reconnect
  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Bot connected!");
      const menu = `🤖 BEN WHITTAKER TECH BOT is online!
👑 Owner: @${OWNER_JID.split("@")[0]}
📌 Prefix: ${PREFIX}`;
      await sock.sendMessage(OWNER_JID, { text: menu });
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // 📁 Load Commands
  const commands = new Map();
  const commandsPath = path.join(__dirname, "commands");
  if (fs.existsSync(commandsPath)) {
    for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"))) {
      const cmd = require(path.join(commandsPath, file));
      if (cmd.name) commands.set(cmd.name.toLowerCase(), cmd);
    }
  } else {
    fs.mkdirSync(commandsPath);
    console.log("📁 Created 'commands' folder.");
  }

  // 💬 Message Handler
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = msg.key.participant || msg.key.remoteJid;
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    // 📸 ViewOnce Bypass
    if (msg.message?.viewOnceMessageV2) {
      const viewOnce = msg.message.viewOnceMessageV2.message;
      const type = Object.keys(viewOnce)[0];
      const stream = await downloadContentFromMessage(viewOnce[type], type.includes("video") ? "video" : "image");
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      await sock.sendMessage(from, { [type]: buffer, caption: "🔓 Opened view once" }, { quoted: msg });
    }

    // 📢 Auto Read Status
    if (from === "status@broadcast") await sock.readMessages([msg.key]);

    // 🎙️ Fake Recording
    await sock.sendPresenceUpdate("recording", from);
    setTimeout(() => sock.sendPresenceUpdate("available", from), 3000);

    // 🚫 Anti-Link Group Settings
    if (isGroup && body.toLowerCase().startsWith(PREFIX + "antlink")) {
      const args = body.trim().split(" ");
      const sub = args[1]?.toLowerCase();
      const option = args[2]?.toLowerCase();
      antiLinkGroups[from] = antiLinkGroups[from] || { enabled: false, action: "remove" };
      if (sub === "on") {
        antiLinkGroups[from].enabled = true;
        await sock.sendMessage(from, { text: "✅ Anti-Link is now *ON*." });
      } else if (sub === "off") {
        antiLinkGroups[from].enabled = false;
        await sock.sendMessage(from, { text: "❌ Anti-Link is now *OFF*." });
      } else if (sub === "action" && ["remove", "warn"].includes(option)) {
        antiLinkGroups[from].action = option;
        await sock.sendMessage(from, { text: `⚙️ Action set to *${option}*` });
      } else {
        await sock.sendMessage(from, {
          text: `🛡️ Use:\n${PREFIX}antlink on\n${PREFIX}antlink off\n${PREFIX}antlink action remove|warn`
        });
      }
    }

    // 🚨 Auto Remove or Warn
    if (isGroup && antiLinkGroups[from]?.enabled) {
      const linkRegex = /https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/;
      const action = antiLinkGroups[from].action;
      if (linkRegex.test(body) && sender !== OWNER_JID) {
        const metadata = await sock.groupMetadata(from);
        const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const botAdmin = metadata.participants.find(p => p.id === botNumber)?.admin;
        if (!botAdmin) return sock.sendMessage(from, { text: "⚠️ I'm not admin." });
        if (action === "warn") {
          await sock.sendMessage(from, { text: `⚠️ *@${sender.split("@")[0]}* no link sharing!`, mentions: [sender] });
        } else if (action === "remove") {
          await sock.sendMessage(from, { text: `🚫 Removed *@${sender.split("@")[0]}*`, mentions: [sender] });
          await sock.groupParticipantsUpdate(from, [sender], "remove");
        }
      }
    }

    // 🎞️ GIF Command via media.json
    const gifMatch = Object.keys(mediaDb).find(key => body.toLowerCase().startsWith(PREFIX + key));
    if (gifMatch) {
      const gifData = mediaDb[gifMatch];
      await sock.sendMessage(from, {
        video: { url: gifData.url },
        caption: gifData.caption || gifMatch,
        gifPlayback: true
      }, { quoted: msg });
      return;
    }

    // ⚙️ Built-in Commands
    for (const [name, command] of commands) {
      if (body.toLowerCase().startsWith(PREFIX + name)) {
        const args = body.trim().split(/\s+/).slice(1);
        try {
          await command.execute(sock, msg, args);
        } catch (err) {
          console.error(`❌ Command error: ${name}`, err);
        }
        break;
      }
    }
  });
}

startBot();
