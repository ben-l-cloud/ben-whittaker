import "dotenv/config"
import express from "express"
import {
  makeWASocket,
  useMultiFileAuthState,
  makeWALegacySocket,
  fetchLatestBaileysVersion,
  generateRegistrationOptions,
  jidNormalizedUser
} from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")))

// Load media
const connectedAudio = fs.readFileSync(path.join(__dirname, "public", "connected.ogg"))
const ommyImage = fs.readFileSync(path.join(__dirname, "public", "ommy.png"))

// QR SESSION
app.get("/start-session", async (req, res) => {
  const number = req.query.number
  if (!number) return res.status(400).json({ error: "Missing number" })

  const sessionId = `session-${Date.now()}`
  const sessionPath = path.join(__dirname, sessionId)
  fs.mkdirSync(sessionPath)

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  let qrSent = false
  sock.ev.on("connection.update", async ({ qr, connection }) => {
    if (qr && !qrSent) {
      qrSent = true
      const qrImage = await qrcode.toDataURL(qr)
      res.json({ qr: qrImage })
    }

    if (connection === "open") {
      console.log("✅ QR Session connected")
      await sendSessionToUser(sock, number, sessionPath, sessionId)
    }
  })
})

// PAIRING CODE SESSION
app.get("/pairing-code", async (req, res) => {
  const number = req.query.number
  if (!number) return res.status(400).json({ error: "Missing number" })

  const sessionId = `pairing-${Date.now()}`
  const sessionPath = path.join(__dirname, sessionId)
  fs.mkdirSync(sessionPath)

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: false,
    browser: ['BenWhittakerTech', 'Chrome', '1.0.0']
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async ({ connection, pairingCode }) => {
    if (pairingCode) {
      return res.json({ pairingCode }) // send pairing code to front-end
    }

    if (connection === "open") {
      console.log("✅ Pairing session connected")
      await sendSessionToUser(sock, number, sessionPath, sessionId)
    }
  })

  await sock.waitForConnectionUpdate(u => u.pairingCode !== undefined)
})

// Shared function to zip and send session
async function sendSessionToUser(sock, number, sessionPath, sessionId) {
  const zipName = `${sessionId}.zip`
  const outputPath = path.join(__dirname, zipName)
  const archiver = await import("archiver")
  const archive = archiver.default("zip", { zlib: { level: 9 } })
  const stream = fs.createWriteStream(outputPath)

  archive.pipe(stream)
  archive.directory(sessionPath, false)
  await archive.finalize()

  const jid = number + "@s.whatsapp.net"

  await sock.sendMessage(jid, {
    document: fs.readFileSync(outputPath),
    mimetype: "application/zip",
    fileName: "session.zip",
    caption: "🧾 Hii hapa session yako kwa ajili ya WhatsApp bot. Tumia ipasavyo!"
  })

  await sock.sendMessage(jid, {
    audio: connectedAudio,
    mimetype: "audio/ogg",
    ptt: true
  })

  await sock.sendMessage(jid, {
    image: ommyImage,
    caption: "👋 Karibu kwenye session yako mpya!"
  })

  setTimeout(() => {
    fs.rmSync(sessionPath, { recursive: true, force: true })
    fs.unlinkSync(outputPath)
    process.exit(0)
  }, 5000)
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
