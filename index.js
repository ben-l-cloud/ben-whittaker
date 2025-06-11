// ✅ BEN WHITTAKER TECH - WhatsApp Bot (index.js)
// 😁 BEN WHITTAKER QUANTUMANIA

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

// Env Configs
const OWNER_NUMBER = process.env.OWNER_NUMBER;
const OWNER_JID = OWNER_NUMBER + "@s.whatsapp.net";
const PREFIX = "!";
const AUTO_BIO = true;
const AUTO_VIEW_ONCE = process.env.AUTO_VIEW_ONCE === "on";
const ANTILINK_ENABLED = process.env.ANTILINK === "on";
const AUTO_TYPING = process.env.AUTO_TYPING === "on";
const RECORD_VOICE_FAKE = process.env.RECORD_VOICE_FAKE === "on";
const AUTO_VIEW_STATUS = process.env.AUTO_VIEW_STATUS === "on";
const AUTO_REACT_EMOJI = process.env.AUTO_REACT_EMOJI || "";

// Load Antilink settings
let antiLinkGroups = {};
try {
  antiLinkGroups = JSON.parse(fs.readFileSync('./antilink.json'));
} catch {
  fs.writeFileSync('./antilink.json', '{}');
}
// Constants
const OWNER_JID = "255654478605@s.whatsapp.net"; // Change to your number with country code + s.whatsapp.net
const PREFIX = "😁";
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

async function startBot() {
  // Load auth credentials and Baileys version
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
      const menu = `🤖 BEN WHITTAKER TECH BOT is online!\n👑 Owner: @${OWNER_JID.split("@")[0]}\n📌 Prefix: ${PREFIX}`;
      await sock.sendMessage(OWNER_JID, { text: menu });
    }
  });

  // Commands map
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

  // Anti-link config for groups
  const antiLinkGroups = {};

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
  //  if (!msg.message || msg.key.fromMe) return; // ignore own messages and empty

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = msg.key.participant || msg.key.remoteJid;
    const body =
  (msg.message && (
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    msg.message.videoMessage?.caption ||
    msg.message.stickerMessage?.caption ||
    msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg.message.buttonsResponseMessage?.selectedButtonId
  )) || "";
    
    // View-once message opener (optional feature)
    if (msg.message?.viewOnceMessageV2) {
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
        const caption = `🔓 *Opened view once* ${isGroup ? "in group 🧑‍🤝‍🧑" : "in DM 📩"} by *@${sender.split("@")[0]}*`;

        await sock.sendMessage(from, { [type]: buffer, caption }, {
          quoted: msg,
          mentions: [sender],
        });
      } catch (e) {
        console.error("❌ Error opening view once message:", e);
      }
    }

    // Auto read and react to status messages
    if (from === "status@broadcast") {
      await sock.readMessages([msg.key]);
      await sock.sendMessage(from, {
        react: {
          text: "🤧",
          key: msg.key,
        },
      });
    }

    // Fake typing presence
    await sock.sendPresenceUpdate("recording", from).catch(() => {});
    setTimeout(() => {
      sock.sendPresenceUpdate("available", from).catch(() => {});
    }, 3000);

    // Anti-link commands & logic
    if (isGroup && body.startsWith(PREFIX + "antilink")) {
      const args = body.trim().split(/\s+/);
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
        } else {
          await sock.sendMessage(from, { text: "⚠️ Use 'remove' or 'warn' only." });
        }
      } else {
        await sock.sendMessage(from, { text: `Usage:\n${PREFIX}antilink on\n${PREFIX}antilink off\n${PREFIX}antilink action remove|warn` });
      }
      return;
    }

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

    // Anti-delete feature (repost deleted messages)
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

    // GIF commands from mediaDb
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

    // Process commands from commands folder
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
