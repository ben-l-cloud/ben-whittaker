const fs = require('fs');
const antilinkFile = './antilink.json';

module.exports = {
  name: "antilink",
  description: "🚫 Auto kick users who send WhatsApp group links",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const sender = msg.participant || msg.key.participant;
    
    // Only works in groups
    if (!jid.endsWith('@g.us')) return;

    const group = await sock.groupMetadata(jid);
    const admins = group.participants.filter(p => p.admin).map(p => p.id);
    const isAdmin = admins.includes(sender);
    const isBotAdmin = admins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");

    // Do nothing if sender is admin
    if (isAdmin) return;

    // Check if antilink is enabled for this group
    let antilinkSettings = {};
    if (fs.existsSync(antilinkFile)) {
      antilinkSettings = JSON.parse(fs.readFileSync(antilinkFile));
    }

    if (!antilinkSettings[jid] || antilinkSettings[jid] !== "on") return;

    const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    // Detect WhatsApp group invite link patterns
    const linkPattern = /(https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+)/i;
    if (linkPattern.test(messageText)) {
      if (!isBotAdmin) {
        await sock.sendMessage(jid, { text: "🤖 I am not admin, cannot remove members." });
        return;
      }

      // Kick the user who sent the link
      await sock.groupParticipantsUpdate(jid, [sender], "remove");
      await sock.sendMessage(jid, { text: `🚫 Removed @${sender.split("@")[0]} for sending group invite link!`, mentions: [sender] });
    }
  },

  // Command to toggle antilink on/off
  toggle: async function(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const sender = msg.participant || msg.key.participant;

    const group = await sock.groupMetadata(jid);
    const admins = group.participants.filter(p => p.admin).map(p => p.id);
    const isAdmin = admins.includes(sender);

    if (!isAdmin) return sock.sendMessage(jid, { text: "⛔ Only admins can toggle antilink." });

    let antilinkSettings = {};
    if (fs.existsSync(antilinkFile)) {
      antilinkSettings = JSON.parse(fs.readFileSync(antilinkFile));
    }

    const arg = args[0]?.toLowerCase();
    if (arg !== "on" && arg !== "off") {
      return sock.sendMessage(jid, { text: "Usage: !antilink on/off" });
    }

    antilinkSettings[jid] = arg;
    fs.writeFileSync(antilinkFile, JSON.stringify(antilinkSettings, null, 2));
    await sock.sendMessage(jid, { text: `✅ Antilink is now *${arg.toUpperCase()}* in this group.` });
  }
};
