// ✅ BEN WHITTAKER TECH - WhatsApp Bot (index.js)
//😁 BEN WHITTAKER QUANTUMANIA

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("🤖 BEN WHITTAKER TECH BOT is running!"));

app.listen(PORT, () => console.log(`✅ Express running on port ${PORT}`));

// Other required imports
const fs = require("fs");
const path = require("path");
const P = require("pino");
const axios = require("axios");
const cheerio = require("cheerio");
const { Boom } = require("@hapi/boom");

// Baileys imports
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  downloadContentFromMessage,
} = require("@whiskeysockets/baileys");

// Constants
const OWNER_JID = "255654478605@s.whatsapp.net";
const PREFIX = "😁";
const antiLinkGroups = {};
const emojiReactions = ["❤️", "😂", "🔥", "👍", "😎", "🤖"];

// Helper function to get a random emoji
const randomEmoji = () => emojiReactions[Math.floor(Math.random() * emojiReactions.length)];

// Load media DB safely
let mediaDb = {};
try {
  mediaDb = JSON.parse(fs.readFileSync("./media/media.json", "utf-8"));
} catch (err) {
  console.warn("⚠️ media.json not found or invalid. GIF commands will be disabled.");
}

// Main bot function
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" })),
    },
    logger: P({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged out. Re-authentication required.");
      }
    } else if (connection === "open") {
      console.log("✅ Bot connected!");
      const menu = `🤖 BEN WHITTAKER TECH BOT is online!
👑 Owner: @${OWNER_JID.split("@")[0]}
📌 Prefix: ${PREFIX}`;
      await sock.sendMessage(OWNER_JID, { text: menu });
    }
  });

  // Load commands dynamically if commands folder exists
  const commands = new Map();
  const commandsPath = path.join(__dirname, "commands");
  if (fs.existsSync(commandsPath)) {
    for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"))) {
      const command = require(path.join(commandsPath, file));
      if (command.name && typeof command.execute === "function") {
        commands.set(command.name, command);
      }
    }
  }

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = msg.key.participant || msg.key.remoteJid;
    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

if (ENABLE_OPEN_VIEW_ONCE && msg.message?.viewOnceMessageV2) {
  try {
    const viewOnce = msg.message.viewOnceMessageV2.message;
    const type = Object.keys(viewOnce)[0];
    const stream = await downloadContentFromMessage(
      viewOnce[type],
      type.includes("video") ? "video" : "image"
    );
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const caption = `🔓 *Opened view once* ${
      isGroup ? "in group 🧑‍🤝‍🧑" : "in DM 📩"
    } by *@${(msg.key.participant || msg.key.remoteJid).split("@")[0]}*`;

    await sock.sendMessage(from, { [type]: buffer, caption }, {
      quoted: msg,
      mentions: [msg.key.participant || msg.key.remoteJid],
    });
  } catch (e) {
    console.error("❌ Error opening view once message:", e);
  }
}
    // Auto-read and react to status messages
if (from === "status@broadcast") {
  await sock.readMessages([msg.key]);
  await sock.sendMessage(from, {
    react: {
      text: "🤧", // emoji reaction
      key: msg.key,
    },
  });
}

    
    // Fake recording presence (typing indicator)
    await sock.sendPresenceUpdate("recording", from).catch(() => {});
    setTimeout(() => {
      sock.sendPresenceUpdate("available", from).catch(() => {});
    }, 3000);

    const antiLinkGroups = {}; // group settings

// Enable/Disable via command
if (isGroup && body.startsWith(PREFIX + "antilink")) {
  const args = body.split(" ");
  const cmd = args[1];
  antiLinkGroups[from] = antiLinkGroups[from] || { enabled: false, warns: {}, action: "remove" };

  if (cmd === "on") {
    antiLinkGroups[from].enabled = true;
    await sock.sendMessage(from, { text: "✅ Anti-Link activated!" });
  } else if (cmd === "off") {
    antiLinkGroups[from].enabled = false;
    await sock.sendMessage(from, { text: "❌ Anti-Link deactivated." });
  } else if (cmd === "action") {
    const act = args[2];
    if (["remove", "warn"].includes(act)) {
      antiLinkGroups[from].action = act;
      await sock.sendMessage(from, { text: `⚙️ Action set to *${act}*` });
    }
  }
  return;
}

// Link Detection + Auto-Warn/Remove
if (isGroup && antiLinkGroups[from]?.enabled) {
  const linkRegex = /(https?:\/\/)?(chat\.whatsapp\.com|t\.me|discord\.gg|facebook\.com|instagram\.com|youtube\.com|tiktok\.com)/i;
  if (linkRegex.test(body)) {
    const metadata = await sock.groupMetadata(from);
    const isBotAdmin = metadata.participants.find(p => p.id === sock.user.id)?.admin;
    const isUserAdmin = metadata.participants.find(p => p.id === sender)?.admin;

    if (!isUserAdmin && isBotAdmin) {
      const group = antiLinkGroups[from];
      group.warns[sender] = (group.warns[sender] || 0) + 1;
      const count = group.warns[sender];

      await sock.sendMessage(from, { react: { text: "⚠️", key: msg.key } });

      if (group.action === "warn" || count < 3) {
        await sock.sendMessage(from, {
          text:
            `╭───「 ⚠️ CYBER-MD DETECTED 」───╮\n` +
            `│ 🚫 *Link Detected!*\n` +
            `│ 👤 User: @${sender.split("@")[0]}\n` +
            `│ ⚠️ Warn Count: ${count}/3\n` +
            `╰──────────────────────────────╯`,
          mentions: [sender],
        });
      } else {
        await sock.sendMessage(from, {
          text: `❌ *@${sender.split("@")[0]}* removed due to repeated link sharing.`,
          mentions: [sender],
        });
        await sock.groupParticipantsUpdate(from, [sender], "remove");
        delete group.warns[sender];
      }
    }
  }
}

    sock.ev.on("messages.update", async (updates) => {
  for (const update of updates) {
    if (update.message === "CONTEXT-INFO: MESSAGE DELETED") {
      try {
        const originalMsg = await sock.loadMessage(update.key.remoteJid, update.key.id);
        if (originalMsg && originalMsg.message) {
          const senderNum = update.key.participant?.split("@")[0] || "unknown";
          const msgType = Object.keys(originalMsg.message)[0];
          const content = originalMsg.message[msgType];

          const alertText = `🚨 *CYBER-MD ALERT!*\n🗑️ Message deleted by @${senderNum}\n🔁 Reposting deleted message:`;

          await sock.sendMessage(update.key.remoteJid, { text: alertText, mentions: [update.key.participant] });
          await sock.sendMessage(update.key.remoteJid, { [msgType]: content });
        }
      } catch (err) {
        console.error("Anti-delete error:", err);
      }
    }
  }
});
    // GIF command via mediaDb
    const gifMatch = Object.keys(mediaDb).find((key) =>
      body.toLowerCase().startsWith(PREFIX + key.toLowerCase())
    );
    if (gifMatch) {
      const gifData = mediaDb[gifMatch];
      await sock.sendMessage(
        from,
        {
          video: { url: gifData.url },
          caption: gifData.caption || gifMatch,
          gifPlayback: true,
        },
        { quoted: msg }
      );
      return;
    }

    // Process built-in commands loaded from commands folder
    for (const [name, command] of commands) {
      if (body.toLowerCase().startsWith(PREFIX + name.toLowerCase())) {
        const args = body.trim().split(/\s+/).slice(1);
        try {
          await command.execute(sock, msg, args);
        } catch (err) {
          console.error(`❌ Command error: ${name}`, err);
          await sock.sendMessage(from, { text: `❌ Error executing command *${name}*.` });
        }
        break;
      }
    }
  });
}

startBot();
