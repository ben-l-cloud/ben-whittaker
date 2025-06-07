module.exports = {
  name: "banwords",
  description: "❌ Add or remove banned words (usage: !banwords add/remove word)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const group = await sock.groupMetadata(jid);
    const admins = group.participants.filter(p => p.admin).map(p => p.id);
    const sender = msg.participant || msg.key.participant;
    const isAdmin = admins.includes(sender);
    const isBotAdmin = admins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");

    if (!isAdmin) return sock.sendMessage(jid, { text: "⛔ Only admins can manage banned words." });
    if (!isBotAdmin) return sock.sendMessage(jid, { text: "🤖 Bot must be admin." });

    const action = args[0]?.toLowerCase();
    const word = args.slice(1).join(" ").toLowerCase();

    if (!["add", "remove"].includes(action) || !word) {
      return sock.sendMessage(jid, { text: "⚠️ Usage: !banwords add/remove [word]" });
    }

    global.groupSettings = global.groupSettings || {};
    global.groupSettings[jid] = global.groupSettings[jid] || {};
    global.groupSettings[jid].bannedWords = global.groupSettings[jid].bannedWords || [];

    if (action === "add") {
      if (global.groupSettings[jid].bannedWords.includes(word)) {
        return sock.sendMessage(jid, { text: `⚠️ Word '${word}' already banned.` });
      }
      global.groupSettings[jid].bannedWords.push(word);
      await sock.sendMessage(jid, { text: `✅ Added banned word: ${word}` });
    } else {
      const index = global.groupSettings[jid].bannedWords.indexOf(word);
      if (index === -1) {
        return sock.sendMessage(jid, { text: `⚠️ Word '${word}' not found in banned list.` });
      }
      global.groupSettings[jid].bannedWords.splice(index, 1);
      await sock.sendMessage(jid, { text: `✅ Removed banned word: ${word}` });
    }
  },
};
