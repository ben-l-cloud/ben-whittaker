import "dotenv/config"
import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import baileys from "@whiskeysockets/baileys"

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = baileys

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(express.static("public"))

app.get("/", (req, res) => {
  res.send("🤖 Ben Whittaker Tech Bot is running!")
})

app.listen(port, () => {
  console.log(`🌐 Express server started on port ${port}`)
})

// Load commands dynamically
const loadCommands = async () => {
  const commands = new Map()
  const folder = path.join(__dirname, "commands")
  if (!fs.existsSync(folder)) return commands

  const files = fs.readdirSync(folder).filter(file => file.endsWith(".mjs"))
  for (const file of files) {
    const commandModule = await import(`./commands/${file}`)
    const command = commandModule.default
    if (command?.name && typeof command?.execute === "function") {
      commands.set(command.name.toLowerCase(), command.execute)
    }
  }
  return commands
}

// Start bot
const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("session")
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("🔌 Connection closed. Reconnecting:", shouldReconnect)
      if (shouldReconnect) startBot()
      else console.log("❌ Logged out. Please delete session folder to restart.")
    } else if (connection === "open") {
      console.log("✅ Bot connected successfully")
    }
  })

  const commands = await loadCommands()

  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages?.[0]
    if (!m?.message || m.key.fromMe) return

    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || ""
    if (!text.startsWith(process.env.PREFIX || "!")) return

    const [cmdRaw, ...args] = text.trim().split(/\s+/)
    const cmd = cmdRaw.slice((process.env.PREFIX || "!").length).toLowerCase()
    const command = commands.get(cmd)
    if (command) {
      try {
        await command(sock, m, args)
      } catch (err) {
        console.error(`❌ Error in command "${cmd}":`, err)
      }
    }
  })
}

startBot()
