import "dotenv/config";
import express from "express";
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import P from "pino";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const connectedAudio = fs.readFileSync(path.join(__dirname, "public", "connected.ogg"));
const ommyImage = fs.readFileSync(path.join(__dirname, "public", "ommy.png"));

// Load commands
const commands = new Map();
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath);
  for (const file of files) {
    if (file.endsWith(".js")) {
      const cmd = await import(`file://${path.join(commandsPath, file)}`);
      commands.set(cmd.name, cmd);
    }
  }
}

app.get("/start-session", async (req, res) => {
  const number = req.query.number;
  const method = req.query.method || "qr";
  if (!number) return res.status(400).json({ error: "Missing number" });

  const sessionId = `session-${Date.now()}`;
  const sessionPath = path.join(__dirname, sessionId);
  fs.mkdirSync(sessionPath);

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  sock.ev.on("creds.update", saveCreds);

  // Auto fake typing
  setInterval(() => {
    if (sock.user?.id) {
      sock.sendPresenceUpdate("composing", sock.user.id);
    }
  }, 6000);

  // Auto open view once
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      if (msg.message?.viewOnceMessageV2) {
        msg.message = msg.message.viewOnceMessageV2.message;
        await sock.readMessages([msg.key]);
      }
    }
  });

  // Auto view status
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      if (msg.key.remoteJid?.includes("status")) {
        await sock.readMessages([msg.key]);
      }
    }
  });

  // Anti-link
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      if (body && body.includes("chat.whatsapp.com")) {
        const jid = msg.key.remoteJid;
        await sock.sendMessage(jid, {
          text: `⚠️ Link sharing is not allowed, warning issued.`,
        });
      }
    }
  });

  // Welcome & goodbye
  sock.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;
    for (const user of participants) {
      if (action === "add") {
        await sock.sendMessage(id, {
          text: `👋 Welcome @${user.split("@")[0]}!`,
          mentions: [user],
        });
      } else if (action === "remove") {
        await sock.sendMessage(id, {
          text: `😢 Goodbye @${user.split("@")[0]}!`,
          mentions: [user],
        });
      }
    }
  });

  if (method === "pairing") {
    try {
      const code = await sock.requestPairingCode(number);
      res.json({ pairingCode: code });
    } catch (err) {
      console.error("Error requesting pairing code:", err);
      res.status(500).json({ error: "Failed to generate pairing code" });
    }
  } else {
    let qrSent = false;
    sock.ev.on("connection.update", async ({ qr, connection }) => {
      if (qr && !qrSent) {
        qrSent = true;
        const qrImage = await qrcode.toDataURL(qr);
        res.json({ qr: qrImage });
      }

      if (connection === "open") {
        console.log("✅ Session connected");

        const zipName = `${sessionId}.zip`;
        const outputPath = path.join(__dirname, zipName);
        const { default: archiver } = await import("archiver");

        const archive = archiver("zip", { zlib: { level: 9 } });
        const stream = fs.createWriteStream(outputPath);

        archive.pipe(stream);
        archive.directory(sessionPath, false);
        await archive.finalize();

        const jid = number + "@s.whatsapp.net";
        await sock.sendMessage(jid, {
          document: fs.readFileSync(outputPath),
          mimetype: "application/zip",
          fileName: "session.zip",
          caption: "🧾 Here is your WhatsApp bot session. Use it wisely!",
        });

        await sock.sendMessage(jid, {
          audio: connectedAudio,
          mimetype: "audio/ogg",
          ptt: true,
        });

        await sock.sendMessage(jid, {
          image: ommyImage,
          caption: "👋 Welcome to your new session!",
        });

        setTimeout(() => {
          fs.rmSync(sessionPath, { recursive: true, force: true });
          fs.unlinkSync(outputPath);
          process.exit(0);
        }, 5000);
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
