import "dotenv/config"
import express from "express"
import baileys from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import path from "path"
import cors from "cors"
import fs from "fs"
import crypto from "crypto"
import { fileURLToPath } from "url"

const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, jidNormalizedUser, Browsers } = baileys

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

const PAIR_CODES_FILE = path.join(__dirname, "pairingCodes.json")
if (!fs.existsSync(PAIR_CODES_FILE)) fs.writeFileSync(PAIR_CODES_FILE, JSON.stringify({}))

// Load all commands from 'commands' folder
const commands = new Map()
const commandsPath = path.join(__dirname, "commands")

async function loadCommands() {
  if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath)
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js") || f.endsWith(".mjs"))
  for (const file of files) {
    try {
      const cmd = await import(`file://${path.join(commandsPath, file)}`)
      if (cmd.default?.name && typeof cmd.default.execute === "function") {
        commands.set(cmd.default.name, cmd.default)
        console.log(`✅ Loaded command: ${cmd.default.name}`)
      }
    } catch (e) {
      console.error(`❌ Failed to load command ${file}:`, e)
    }
  }
}
await loadCommands()

// Global state for QR socket
let qrSock = null
let latestQR = null

async function startQRSock() {
  const sessionPath = path.join(__dirname, "qr-session")
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()
  qrSock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: false,
    browser: Browsers.macOS("BenWhittakerTech"),
  })

  qrSock.ev.on("creds.update", saveCreds)

  qrSock.ev.on("connection.update", async ({ qr, connection }) => {
    if (qr) {
      latestQR = await qrcode.toDataURL(qr)
      console.log("📡 QR code updated")
    }
    if (connection === "open") {
      latestQR = null
      console.log("✅ QR paired successfully")
    }
    if (connection === "close") {
      console.log("❌ QR socket disconnected, restarting...")
      qrSock = null
      latestQR = null
      await startQRSock() // restart
    }
  })
}
await startQRSock()

app.get("/qr", (req, res) => {
  if (latestQR) {
    res.json({ qr: latestQR })
  } else {
    res.json({ status: "No QR available or already paired" })
  }
})

// Map to keep active sockets for each pairing session: key=code, value={sock, state, saveCreds, number}
const activePairings = new Map()

// POST /generate-code to create pairing code valid 5 min
app.post("/generate-code", (req, res) => {
  const { number } = req.body
  if (!number) return res.status(400).json({ error: "🚫 Hakuna namba ya simu." })

  const code = crypto.randomBytes(4).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6)
  const pairings = JSON.parse(fs.readFileSync(PAIR_CODES_FILE))
  pairings[code] = {
    number,
    createdAt: Date.now()
  }
  fs.writeFileSync(PAIR_CODES_FILE, JSON.stringify(pairings, null, 2))
  res.json({ code, expiresIn: "5 minutes" })
})

// POST /link-device to start pairing using code
app.post("/link-device", async (req, res) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ error: "🚫 Hakuna code ya pairing." })

  const pairings = JSON.parse(fs.readFileSync(PAIR_CODES_FILE))
  const entry = pairings[code]
  if (!entry) return res.status(404).json({ error: "⚠️ Code haipo au si sahihi." })

  const now = Date.now()
  if (now - entry.createdAt > 5 * 60 * 1000) {
    delete pairings[code]
    fs.writeFileSync(PAIR_CODES_FILE, JSON.stringify(pairings, null, 2))
    return res.status(410).json({ error: "⌛ Code ime-expire (zaidi ya dakika 5)." })
  }

  if (activePairings.has(code)) {
    return res.status(409).json({ error: "⚠️ Pairing session tayari ipo." })
  }

  const number = entry.number
  const sessionId = `pair-${code}`
  const sessionPath = path.join(__dirname, sessionId)
  fs.mkdirSync(sessionPath, { recursive: true })

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: false,
    browser: Browsers.macOS("BenWhittakerTech"),
    generateHighQualityLinkPreview: true,
  })

  sock.ev.on("creds.update", saveCreds)

  // Store active pairing
  activePairings.set(code, { sock, state, saveCreds, number })

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ Paired with:", number)
      // Remove pairing code since paired
      delete pairings[code]
      fs.writeFileSync(PAIR_CODES_FILE, JSON.stringify(pairings, null, 2))

      // Respond success once per request
      if (!res.headersSent) {
        res.json({ status: "✅ Paired successfully" })
      }
    }
    if (connection === "close") {
      console.log(`❌ Connection closed for ${number}, reason:`, lastDisconnect?.error?.output?.statusCode)
      activePairings.delete(code)
    }
  })

  // Auto fake recording presence
  if (process.env.AUTO_RECORDING_FAKE?.toLowerCase() === "on") {
    setInterval(() => {
      sock.sendPresenceUpdate("recording", `${number}@s.whatsapp.net`).catch(() => {})
    }, 5000)
  }

  // Auto view status
  if (process.env.AUTO_VIEW_STATUS?.toLowerCase() === "on") {
    sock.ev.on("messages.upsert", async ({ messages }) => {
      for (const msg of messages) {
        if (msg.message?.protocolMessage?.type === 3 && msg.key.remoteJid.includes("status")) {
          try {
            await sock.readMessages([msg.key])
            console.log("👀 Viewed status from:", msg.key.remoteJid)
          } catch {}
        }
      }
    })
  }

  // Auto open view once
  if (process.env.AUTO_OPEN_VIEW_ONCE?.toLowerCase() === "on") {
    sock.ev.on("messages.upsert", async ({ messages }) => {
      for (const msg of messages) {
        if (msg.message?.viewOnceMessageV2) {
          const media = msg.message.viewOnceMessageV2.message
          await sock.sendMessage(msg.key.remoteJid, { forward: true, message: media })
        }
      }
    })
  }

  // Command handler
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text
    if (!body) return

    const prefix = "!"
    if (!body.startsWith(prefix)) return

    const [cmdName, ...args] = body.slice(prefix.length).split(" ")
    const command = commands.get(cmdName.toLowerCase())
    if (command) {
      await command.execute(sock, msg, args)
    }
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
