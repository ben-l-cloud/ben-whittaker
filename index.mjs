import "dotenv/config";
import express from "express";
import baileys from "@whiskeysockets/baileys";
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, jidNormalizedUser } = baileys;
import qrcode from "qrcode";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const connectedAudio = fs.readFileSync(path.join(__dirname, "public", "connected.ogg"));
const ommyImage = fs.readFileSync(path.join(__dirname, "public", "ommy.png"));

const PAIR_CODES_FILE = path.join(__dirname, "pairingCodes.json");
if (!fs.existsSync(PAIR_CODES_FILE)) fs.writeFileSync(PAIR_CODES_FILE, JSON.stringify({}));

app.post("/generate-code", async (req, res) => {
  const { number } = req.body;
  if (!number) return res.status(400).json({ error: "Missing number" });

  const code = Math.floor(10000000 + Math.random() * 90000000).toString();
  const pairings = JSON.parse(fs.readFileSync(PAIR_CODES_FILE));
  pairings[code] = number;
  fs.writeFileSync(PAIR_CODES_FILE, JSON.stringify(pairings, null, 2));

  return res.json({ code });
});

app.get("/link-device", async (req, res) => {
  try {
    const { code } = req.query;
    const pairings = JSON.parse(fs.readFileSync(PAIR_CODES_FILE));
    const number = pairings[code];
    if (!number) return res.status(404).json({ error: "Invalid code" });

    const sessionId = `pair-${code}`;
    const sessionPath = path.join(__dirname, sessionId);
    fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      auth: state,
      version,
      printQRInTerminal: false,
      browser: ["BenWhittakerTech", "Chrome", "1.0.0"],
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, qr, pairingCode } = update;
      if (qr) {
        // QR generated but do nothing since we are pairing via code
      }
      if (pairingCode) {
        // If pairing code available, send it as JSON response
        if (!res.headersSent) {
          res.json({ pairingCode });
        }
      }
      if (connection === "open") {
        console.log("✅ Pairing complete");
        await sendSessionToUser(sock, number, sessionPath, sessionId);
        if (!res.headersSent) {
          res.json({ status: "Pairing complete, session sent" });
        }
      }
      if (connection === "close") {
        console.log("Connection closed");
      }
    });

    // Wait for pairingCode event before continuing (timeout if needed)
    // This line waits until pairingCode is emitted, but we handle it with event listener above.
    // await sock.waitForConnectionUpdate((u) => u.pairingCode !== undefined);

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

async function sendSessionToUser(sock, number, sessionPath, sessionId) {
  const zipName = `${sessionId}.zip`;
  const outputPath = path.join(__dirname, zipName);
  const archiver = await import("archiver");
  const archive = archiver.default("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outputPath);

  archive.pipe(stream);
  archive.directory(sessionPath, false);
  await archive.finalize();

  // Wait for the stream to finish before sending
  await new Promise((resolve, reject) => {
    stream.on("close", resolve);
    stream.on("error", reject);
  });

  const jid = jidNormalizedUser(number);

  await sock.sendMessage(jid, {
    document: fs.readFileSync(outputPath),
    mimetype: "application/zip",
    fileName: "session.zip",
    caption: "🧾 Hii hapa session yako kwa ajili ya WhatsApp bot. Tumia ipasavyo!",
  });

  await sock.sendMessage(jid, {
    audio: connectedAudio,
    mimetype: "audio/ogg",
    ptt: true,
  });

  await sock.sendMessage(jid, {
    image: ommyImage,
    caption: "👋 Karibu kwenye session yako mpya!",
  });

  setTimeout(() => {
    try {
      fs.rmSync(sessionPath, { recursive: true, force: true });
      fs.unlinkSync(outputPath);
    } catch (e) {
      console.error("Error cleaning up files:", e);
    }
    process.exit(0);
  }, 7000);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
