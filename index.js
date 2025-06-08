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

    // Automatically open ViewOnce messages
    if (msg.message.viewOnceMessageV2) {
      try {
        const viewOnce = msg.message.viewOnceMessageV2.message;
        const type = Object.keys(viewOnce)[0];
        const stream = await downloadContentFromMessage(
          viewOnce[type],
          type.includes("video") ? "video" : "image"
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        await sock.sendMessage(from, { [type]: buffer, caption: `🔓 Opened view once` }, { quoted: msg });
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

// Anti-Link Config Store
const antiLinkGroups = {}; // { [groupJid]: { enabled: true, action: "remove", warns: { [jid]: count } } }

// Anti-Link Command Handling
if (isGroup && body.toLowerCase().startsWith(PREFIX + "antlink")) {
  const args = body.trim().split(" ");
  const sub = args[1]?.toLowerCase();
  const option = args[2]?.toLowerCase();
  antiLinkGroups[from] = antiLinkGroups[from] || { enabled: false, action: "remove", warns: {} };

  if (sub === "on") {
    antiLinkGroups[from].enabled = true;
    antiLinkGroups[from].warns = {}; // reset warns
    await sock.sendMessage(from, { text: "✅ Anti-Link is now *ON*." });
  } else if (sub === "off") {
    antiLinkGroups[from].enabled = false;
    antiLinkGroups[from].warns = {};
    await sock.sendMessage(from, { text: "❌ Anti-Link is now *OFF*." });
  } else if (sub === "action" && ["remove", "warn"].includes(option)) {
    antiLinkGroups[from].action = option;
    await sock.sendMessage(from, { text: `⚙️ Action set to *${option}*` });
  } else {
    await sock.sendMessage(from, {
      text: `🛡️ Use:\n${PREFIX}antlink on\n${PREFIX}antlink off\n${PREFIX}antlink action remove|warn`,
    });
  }
  return;
}

// Anti-Link Enforcement
if (isGroup && antiLinkGroups[from]?.enabled) {
  const linkRegex = /(https?:\/\/)?(chat\.whatsapp\.com|t\.me|discord\.gg|instagram\.com|youtube\.com|facebook\.com|tiktok\.com)/i;
  const action = antiLinkGroups[from].action;
  const offender = sender;
  const metadata = await sock.groupMetadata(from);
  const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
  const botAdmin = metadata.participants.find(p => p.id === botNumber)?.admin;
  const isAdmin = metadata.participants.find(p => p.id === offender)?.admin;

  if (linkRegex.test(body) && offender !== OWNER_JID && !isAdmin) {
    if (!botAdmin) {
      await sock.sendMessage(from, { text: "⚠️ I'm not admin, I can't enforce anti-link." });
      return;
    }

    antiLinkGroups[from].warns[offender] = (antiLinkGroups[from].warns[offender] || 0) + 1;
    const warnings = antiLinkGroups[from].warns[offender];

    if (warnings < 4) {
      await sock.sendMessage(from, {
        text: `⚠️ *@${offender.split("@")[0]}*, you shared a link.\n🚫 This is warning ${warnings}/3.`,
        mentions: [offender],
      });
    } else {
      await sock.sendMessage(from, {
        text: `❌ *@${offender.split("@")[0]}* has been removed for repeated link sharing.`,
        mentions: [offender],
      });
      try {
        await sock.groupParticipantsUpdate(from, [offender], "remove");
        delete antiLinkGroups[from].warns[offender]; // reset warning count after kick
      } catch (err) {kill
        console.error("Remove error:", err);
        await sock.sendMessage(from, { text: "❌ Failed to remove user. Check my admin rights." });
      }
    }
  }
}
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
