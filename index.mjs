import "dotenv/config"
import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"

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

const loadCommands = async () => {
  const commands = new Map()
  const files = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".mjs"))
  for (const file of files) {
    const command = await import(`./commands/${file}`)
    if (command.name && command.execute) {
      commands.set(command.name, command.execute)
    }
  }
  return commands
}

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("session")
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      let shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("🔌 Connection closed. Reconnecting:", shouldReconnect)
      if (shouldReconnect) startBot()
    } else if (connection === "open") {
      console.log("✅ Bot connected successfully")
    }
  })

  const commands = await loadCommands()

  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0]
    if (!m.message || m.key.fromMe) return

    const text = m.message.conversation || m.message.extendedTextMessage?.text
    if (!text) return

    const [cmd, ...args] = text.trim().split(/\s+/)
    const command = commands.get(cmd.toLowerCase())
    if (command) {
      try {
        await command(sock, m, args)
      } catch (e) {
        console.error("❌ Error executing command:", e)
      }
    }
  })
}

startBot()
