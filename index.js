const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const P = require('pino')
const fs = require('fs')
const path = require('path')
const express = require('express')
require('dotenv').config()

const OWNER_NUMBER = process.env.OWNER_NUMBER || '255654478605'
let MODE = process.env.MODE || 'private'
const PREFIX = '$'  // Prefix ya commands

const CONFIG = {
  AUTO_TYPING: process.env.AUTO_TYPING === 'on',
  AUTO_REACT: process.env.AUTO_REACT === 'on',
  AUTO_BIO: process.env.AUTO_BIO === 'on',
  FAKE_RECORDING: process.env.FAKE_RECORDING === 'on',
  AUTO_VIEW_ONCE: process.env.AUTO_VIEW_ONCE === 'on',
  ANTI_BAD: process.env.ANTI_BAD === 'on',
  ANTI_LINK: process.env.ANTI_LINK === 'on',
  NSFW: process.env.NSFW === 'on',
  AI_CHAT: process.env.AI_CHAT === 'on',
  VOICE_AI: process.env.VOICE_AI === 'on',
  IMAGE_GEN: process.env.IMAGE_GEN === 'on',
  STICKER_CMD: process.env.STICKER_CMD === 'on',
  YT_MUSIC: process.env.YT_MUSIC === 'on',
  PDF_TOOLS: process.env.PDF_TOOLS === 'on',
  OWNER_ONLY_MODE: process.env.OWNER_ONLY_MODE === 'on',
  MENU_ENABLED: process.env.MENU_ENABLED === 'on',
}

const SETTINGS_FILE = './settings.json'
let settings = { antilink: CONFIG.ANTI_LINK, nsfw: CONFIG.NSFW, mode: MODE }
if (fs.existsSync(SETTINGS_FILE)) {
  settings = JSON.parse(fs.readFileSync(SETTINGS_FILE))
} else {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}
const saveSettings = () => fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))

const app = express()
const port = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.send('Ben Whittaker Tech Bot is running!')
})
app.listen(port, () => {
  console.log(`Express server running on port ${port}`)
})

const startSock = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }))
    }
  })

  sock.ev.on('creds.update', saveCreds)

  // Auto view once + notify owner
  sock.ev.on('messages.update', async (m) => {
    for (const msg of m) {
      try {
        if (msg.message?.viewOnceMessage && CONFIG.AUTO_VIEW_ONCE) {
          await sock.readMessages([msg.key])

          const viewer = msg.key.participant || msg.key.remoteJid
          const viewerName = viewer.split('@')[0]
          const ownerJid = OWNER_NUMBER + '@s.whatsapp.net'

          await sock.sendMessage(ownerJid, { text: `📢 User @${viewerName} ame-view status yako.` })
        }
      } catch (error) {
        console.error('Error in auto view once:', error)
      }
    }
  })

  sock.ev.on('group-participants.update', async (update) => {
    const metadata = await sock.groupMetadata(update.id)
    for (const participant of update.participants) {
      const name = (await sock.onWhatsApp(participant))[0]?.notify || 'mtumiaji'
      if (update.action === 'add') {
        await sock.sendMessage(update.id, { text: `👋 Karibu @${participant.split('@')[0]} kwenye *${metadata.subject}*`, mentions: [participant] })
      } else if (update.action === 'remove') {
        await sock.sendMessage(update.id, { text: `👋 Kwa heri @${participant.split('@')[0]}`, mentions: [participant] })
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    const sender = msg.key.participant || msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const isOwner = sender.includes(OWNER_NUMBER)

    if (CONFIG.AUTO_TYPING) await sock.sendPresenceUpdate('composing', from)
    if (CONFIG.FAKE_RECORDING) await sock.sendPresenceUpdate('recording', from)

    if (settings.antilink && isGroup && /https?:\/\/\S+/.test(body)) {
      await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} Link si ruhusa hapa!`, mentions: [sender] })
      return
    }

    if (settings.nsfw && /(porn|xxx|nsfw)/i.test(body)) {
      await sock.sendMessage(from, { text: '⛔ Hii aina ya content haifai hapa!' })
      return
    }

    // Command handler
    if (body.startsWith(PREFIX + 'setmode') && isOwner) {
      const newMode = body.split(' ')[1]
      if (newMode === 'private' || newMode === 'public') {
        MODE = newMode
        settings.mode = MODE
        saveSettings()
        await sock.sendMessage(from, { text: `✅ Mode imebadilika kuwa *${MODE}*` })
      }
      return
    }

    if (body.startsWith(PREFIX + 'antilink') && isOwner) {
      const arg = body.split(' ')[1]
      if (arg === 'on' || arg === 'off') {
        settings.antilink = arg === 'on'
        saveSettings()
        await sock.sendMessage(from, { text: `⚙️ Antilink imewekwa kuwa *${arg}*` })
      }
      return
    }

    if (body.startsWith(PREFIX + 'nsfw') && isOwner) {
      const arg = body.split(' ')[1]
      if (arg === 'on' || arg === 'off') {
        settings.nsfw = arg === 'on'
        saveSettings()
        await sock.sendMessage(from, { text: `⚙️ NSFW blocker imewekwa kuwa *${arg}*` })
      }
      return
    }

    if (settings.mode === 'private' && !isOwner) {
      return await sock.sendMessage(from, { text: '🚫 This bot is private. Tafuta yako 👎' })
    }

    // Other command handling ...
  })

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) startSock()
    } else if (connection === 'open') {
      console.log('✅ BOT IS RUNNING')
    }
  })
}

startSock()
