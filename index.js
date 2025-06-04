// index.js

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const P = require('pino')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const OWNER_NUMBER = process.env.OWNER_NUMBER || '255654478605'
let MODE = process.env.MODE || 'private' // private au public
const FAKE_RECORDING = process.env.FAKE_RECORDING === 'on'
const GIF_COMMANDS = process.env.GIF_COMMANDS === 'on'

const WELCOME_MSG = '👋 Karibu sana! Tumia vizuri bot hii. 😊'
const GOODBYE_MSG = '👋 Umeondoka group, kwa heri!'

const SETTINGS_FILE = './settings.json'
let settings = { antilink: true, nsfw: true, mode: MODE }

// Load settings or create default
if (fs.existsSync(SETTINGS_FILE)) {
  settings = JSON.parse(fs.readFileSync(SETTINGS_FILE))
} else {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

const saveSettings = () => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

const loadPlugins = () => {
  const plugins = new Map()
  const pluginFolder = path.join(__dirname, 'plugins')
  if (fs.existsSync(pluginFolder)) {
    fs.readdirSync(pluginFolder).forEach(file => {
      if (file.endsWith('.js')) {
        const plugin = require(path.join(pluginFolder, file))
        if (plugin.name) plugins.set(plugin.name, plugin)
      }
    })
  }
  return plugins
}

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

  // Auto view status
  sock.ev.on('messages.update', async m => {
    for (let msg of m) {
      if (msg.update.messageStubType === 32) {
        await sock.readMessages([msg.key])
      }
    }
  })

  // Welcome & Goodbye
  sock.ev.on('group-participants.update', async (update) => {
    const metadata = await sock.groupMetadata(update.id)
    for (const participant of update.participants) {
      const name = (await sock.onWhatsApp(participant))[0]?.notify || 'mtumiaji'
      if (update.action === 'add') {
        await sock.sendMessage(update.id, { text: `👋 Karibu @${participant.split('@')[0]} kwenye *${metadata.subject}*\n${WELCOME_MSG}`, mentions: [participant] })
      } else if (update.action === 'remove') {
        await sock.sendMessage(update.id, { text: `👋 Kwa heri @${participant.split('@')[0]}\n${GOODBYE_MSG}`, mentions: [participant] })
      }
    }
  })

  const commands = loadPlugins()

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    const sender = msg.key.participant || msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const isOwner = sender.includes(OWNER_NUMBER)

    if (FAKE_RECORDING) await sock.sendPresenceUpdate('recording', from)

    // Antilink
    if (settings.antilink && isGroup && /https?:\/\/\S+|www\.\S+/.test(body)) {
      await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} Link si ruhusa hapa!`, mentions: [sender] })
      return
    }

    // NSFW Blocker
    if (settings.nsfw && /(porn|xxx|nsfw)/i.test(body)) {
      await sock.sendMessage(from, { text: '⛔ Hii aina ya content haifai hapa!' })
      return
    }

    if (body.startsWith('!setmode') && isOwner) {
      const newMode = body.split(' ')[1]
      if (newMode === 'private' || newMode === 'public') {
        MODE = newMode
        settings.mode = MODE
        saveSettings()
        await sock.sendMessage(from, { text: `✅ Mode imebadilika kuwa *${MODE}*` })
      }
      return
    }

    if (body.startsWith('!antilink') && isOwner) {
      const arg = body.split(' ')[1]
      if (arg === 'on' || arg === 'off') {
        settings.antilink = arg === 'on'
        saveSettings()
        await sock.sendMessage(from, { text: `⚙️ Antilink imewekwa kuwa *${arg}*` })
      }
      return
    }

    if (body.startsWith('!nsfw') && isOwner) {
      const arg = body.split(' ')[1]
      if (arg === 'on' || arg === 'off') {
        settings.nsfw = arg === 'on'
        saveSettings()
        await sock.sendMessage(from, { text: `⚙️ NSFW blocker imewekwa kuwa *${arg}*` })
      }
      return
    }

    if (settings.mode === 'private' && !isOwner) {
      return await sock.sendMessage(from, { text: '🚫 This is not your bot tafuta lako na ulichezee kenge wewe!' })
    }

    if (body.startsWith('!')) {
      const args = body.slice(1).trim().split(/ +/)
      const name = args.shift().toLowerCase()
      const cmd = commands.get(name)
      if (cmd) {
        try {
          if (GIF_COMMANDS && cmd.gif) {
            await sock.sendMessage(from, { image: { url: cmd.gif }, caption: `🎬 *${name}*` })
          }
          await cmd.execute(sock, msg, args)
        } catch (e) {
          console.error(e)
          await sock.sendMessage(from, { text: '⚠️ Kuna error kwenye command.' })
        }
      }
    }
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
