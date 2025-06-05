const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const { Boom } = require('@hapi/boom');
const P = require("pino");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 EXPRESS SERVER
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use(express.static("."));
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// 📁 SESSION
const SESSION_FOLDER = "./sessions";

// 🤖 BOT START
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P().info),
    },
    logger: P({ level: "silent" }),
    browser: ["BenWhittakerBot", "Safari", "1.0.0"],
  });

  // 🟩 QR CODE LISTENER
  sock.ev.on("connection.update", ({ qr, connection, lastDisconnect }) => {
    if (qr) {
      console.log("📲 Scan QR Code Below:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("❌ Disconnected. Reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected Successfully!");
    }
  });

  // 💾 SAVE CREDENTIALS
  sock.ev.on("creds.update", saveCreds);

  // 🔗 PAIRING CODE (optional)
  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode(process.env.OWNER_NUMBER);
    console.log(`🔗 Pair Code: ${code}`);
  }

  // 📥 HANDLE MESSAGES
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    const body =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      "";

    // 🧪 COMMAND SAMPLE (!ping)
    if (body.toLowerCase() === "!ping") {
      await sock.sendMessage(from, { text: "🥊 Pong!" }, { quoted: msg });
    }

    // 🔗 ANTILINK
    if (process.env.ANTILINK === "on" && /chat.whatsapp.com\/[A-Za-z0-9]{22,}/i.test(body)) {
      if (!msg.key.fromMe) {
        await sock.sendMessage(from, { text: "⚠️ Link Detected! Goodbye 👋" }, { quoted: msg });
        await sock.groupParticipantsUpdate(from, [msg.key.participant], "remove");
        console.log("🚫 Antilink: User removed");
      }
    }

    // 👁️ VIEW ONCE
    if (process.env.AUTO_VIEW_ONCE === "on" && msg.message.viewOnceMessageV2) {
      const viewOnce = msg.message.viewOnceMessageV2.message;
      await sock.sendMessage(from, { forward: viewOnce }, { quoted: msg });
      console.log("👁️ ViewOnce auto-opened");
    }

    // 🎙️ FAKE RECORDING
    if (process.env.FAKE_RECORDING === "on") {
      await sock.sendPresenceUpdate("recording", from);
      console.log("🎙️ Fake recording triggered");
    }

    // 📡 AUTO VIEW STATUS
    if (process.env.AUTO_VIEW_STATUS === "on" && from?.startsWith("status@broadcast")) {
      await sock.readMessages([msg.key]);
      console.log("👁️ Auto-viewed status");
    }
  });
}

startBot();
