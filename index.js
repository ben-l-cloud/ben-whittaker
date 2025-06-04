const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");
const { Boom } = require('@hapi/boom');
const P = require("pino");
const fs = require("fs");
const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🌍 EXPRESS SERVER FOR RENDER
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use(express.static("."));
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// 🔑 SESSION AUTH
const SESSION_FOLDER = "./sessions";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P().info),
    },
    logger: P({ level: "silent" }),
    browser: ["BenWhittakerBot", "Safari", "1.0.0"],
  });

  // 📱 Pairing Code
  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode(process.env.OWNER_NUMBER);
    console.log(`🔗 Pair Code: ${code}`);
  }

  // 🧠 LOAD COMMANDS FROM 'commands/' FOLDER
  const commandPath = path.join(__dirname, "commands");
  fs.readdirSync(commandPath).forEach(file => {
    require(path.join(commandPath, file))(sock);
  });

  sock.ev.on("creds.update", saveCreds);

  // 📥 Handle Messages
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    // 🔗 Modern Antilink
    if (process.env.ANTILINK === "on" && /chat.whatsapp.com\/[A-Za-z0-9]{22,}/i.test(body)) {
      if (!msg.key.fromMe) {
        await sock.sendMessage(from, { text: "⚠️ Link Detected! Goodbye 👋" }, { quoted: msg });
        await sock.groupParticipantsUpdate(from, [msg.key.participant], "remove");
        console.log("🚫 Antilink: User removed");
      }
    }

    // 👁️ Auto Open ViewOnce
    if (process.env.AUTO_VIEW_ONCE === "on" && msg.message.viewOnceMessageV2) {
      const viewOnce = msg.message.viewOnceMessageV2.message;
      await sock.sendMessage(from, { forward: viewOnce }, { quoted: msg });
      console.log("👁️ ViewOnce auto-opened");
    }

    // 🎙️ Fake Recording
    if (process.env.FAKE_RECORDING === "on") {
      await sock.sendPresenceUpdate("recording", from);
      console.log("🎙️ Fake recording triggered");
    }

    // 👀 Auto View Status
    if (
      process.env.AUTO_VIEW_STATUS === "on" &&
      from && from.startsWith("status@broadcast")
    ) {
      await sock.readMessages([msg.key]);
      console.log("👁️ Auto-viewed status");
    }
  });
}

startBot();
