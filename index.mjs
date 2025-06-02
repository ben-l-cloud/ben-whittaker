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

// QR Scan Page
app.get("/", (req, res) => {
  res.send(`
    <h1>Ben Whittaker Tech Bot</h1>
    <form action="/generate-qr" method="get">
      <input type="text" name="phone" placeholder="Enter your WhatsApp number e.g. 2557xxxxxxx" required />
      <button type="submit">Scan QR Code</button>
    </form>
  `)
})

// QR Generation Endpoint
app.get("/generate-qr", async (req, res) => {
  const user = req.query.phone
  if (!user) return res.send("Missing phone number!")

  const sessionFolder = path.join(__dirname, "sessions", user)
  if (!fs.existsSync("sessions")) fs.mkdirSync("sessions")

  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)
  const sock = makeWASocket({ auth: state })

  sock.ev.on("connection.update", async ({ connection, qr }) => {
    if (qr) {
      const img = await qrcode.toDataURL(qr)
      res.send(`
        <h2>Scan QR with WhatsApp</h2>
        <img src="${img}" />
        <p>QR Code expires in 30 seconds. Session will be sent to your WhatsApp after scan.</p>
      `)
    }

    if (connection === "open") {
      console.log("✅ WhatsApp connected!")
      await saveCreds()

      const zipPath = path.join(__dirname, "sessions", `${user}.zip`)
      const output = fs.createWriteStream(zipPath)
      const archive = archiver("zip", { zlib: { level: 9 } })

      archive.pipe(output)
      archive.directory(sessionFolder, false)
      await archive.finalize()

      // Send zip file to user's WhatsApp
      await sock.sendMessage(`${user}@s.whatsapp.net`, {
        document: fs.readFileSync(zipPath),
        mimetype: "application/zip",
        fileName: "your-whatsapp-session.zip",
        caption: "✅ Here is your WhatsApp session file. Use it to deploy your bot!"
      })

      // Cleanup after 60 seconds
      setTimeout(() => {
        fs.rmSync(sessionFolder, { recursive: true, force: true })
        fs.unlinkSync(zipPath)
      }, 60000)

      sock.end()
    }
  })

  sock.ev.on("creds.update", saveCreds)
})

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`)
})
