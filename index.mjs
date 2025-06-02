import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import archiver from "archiver"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(express.static("public"))

app.get("/", (req, res) => {
  res.send(`
    <h1>Ben Whittaker Tech Bot - Session Generator</h1>
    <form action="/generate-qr" method="get">
      <input type="text" name="phone" placeholder="Enter WhatsApp number (e.g. 2557xxxxxxx)" required />
      <button type="submit">Generate QR Code</button>
    </form>
  `)
})

app.get("/generate-qr", async (req, res) => {
  const user = req.query.phone
  if (!user) return res.send("⚠️ Phone number is required!")

  const sessionFolder = path.join(__dirname, "sessions", user)
  if (!fs.existsSync("sessions")) fs.mkdirSync("sessions", { recursive: true })

  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)
  const sock = makeWASocket({ auth: state })

  let sentResponse = false

  sock.ev.on("connection.update", async ({ connection, qr }) => {
    if (qr && !sentResponse) {
      sentResponse = true
      const img = await qrcode.toDataURL(qr)
      res.send(`
        <h2>Scan QR with WhatsApp</h2>
        <img src="${img}" />
        <p>Scan the QR code with WhatsApp on your phone.</p>
        <p>After successful scan, your session files will be sent to your WhatsApp number.</p>
      `)
    }

    if (connection === "open") {
      console.log("✅ WhatsApp connected for user", user)
      await saveCreds()

      // Zip session folder
      const zipPath = path.join(__dirname, "sessions", `${user}.zip`)
      const output = fs.createWriteStream(zipPath)
      const archive = archiver("zip", { zlib: { level: 9 } })

      archive.pipe(output)
      archive.directory(sessionFolder, false)
      await archive.finalize()

      // Send session zip to user's WhatsApp
      await sock.sendMessage(`${user}@s.whatsapp.net`, {
        document: fs.readFileSync(zipPath),
        mimetype: "application/zip",
        fileName: "whatsapp-session.zip",
        caption: "✅ Your WhatsApp session files. Use these to deploy your bot."
      })

      // Cleanup after 1 minute
      setTimeout(() => {
        fs.rmSync(sessionFolder, { recursive: true, force: true })
        if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)
      }, 60000)

      sock.end()
    }
  })

  sock.ev.on("creds.update", saveCreds)
})

app.listen(port, () => {
  console.log(`🌐 Server running at http://localhost:${port}`)
})
