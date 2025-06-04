const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const P = require('pino')
const fs = require('fs')
const path = require('path')
const express = require('express')
require('dotenv').config()

const got = require('got')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg')
const { PassThrough } = require('stream')

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

async function gifUrlToMp4Buffer(gifUrl) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await got.stream(gifUrl)
      const chunks = []
      const streamPass = new PassThrough()

      ffmpeg(response)
        .inputFormat('gif')
        .outputOptions([
          '-movflags frag_keyframe+empty_moov',
          '-pix_fmt yuv420p',
          '-vf scale=320:-2',
          '-c:v libx264',
          '-profile:v baseline',
          '-level 3.0',
          '-an',
          '-f mp4'
        ])
        .format('mp4')
        .on('error', (err) => reject(err))
        .pipe(streamPass)

      streamPass.on('data', (chunk) => chunks.push(chunk))
      streamPass.on('end', () => resolve(Buffer.concat(chunks)))
    } catch (error) {
      reject(error)
    }
  })
}

const OWNER_NUMBER = process.env.OWNER_NUMBER || '255654478605'
let MODE = process.env.MODE || 'private'
const PREFIX = '$'

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

// Load all command modules from /commands
const commands = new Map()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  if (command.name && typeof command.execute === 'function') {
    commands.set(command.name, command)
  }
}

const media = require('./media.json') // Make sure this file exists and has the GIF URLs

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

    if (settings.mode === 'private' && !isOwner) {
      return await sock.sendMessage(from, { text: '🚫 This bot is private. Tafuta yako 👎' })
    }

    if (body.startsWith(PREFIX)) {
      const args = body.slice(PREFIX.length).trim().split(/ +/)
      const commandName = args.shift().toLowerCase()
      const command = commands.get(commandName)

      if (command) {
        try {
          await command.execute(sock, msg, args, from, sender)
        } catch (err) {
          console.error(err)
          await sock.sendMessage(from, { text: '⚠️ Error executing command.' })
        }
      } else {
        // Mfano wa command ya hug inayo-convert GIF URL kwenda MP4 video na kutuma
        if (commandName === 'hug') {
          try {
            const mp4Buffer = await gifUrlToMp4Buffer(media.hug)
            await sock.sendMessage(from, {
              video: mp4Buffer,
              mimetype: 'video/mp4',
              caption: '🤗 Hii ni hug video!'
            })
          } catch (error) {
            console.error('Error sending hug video:', error)
            await sock.sendMessage(from, { text: '❌ Tatizo la kutuma hug video.' })
          }
        }
        // Ongeza commands nyingine kama unavyotaka kwa mfano huu
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
