module.exports = {
  name: "online",
  description: "📶 Show group members currently online (typing or last seen)",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const group = await sock.groupMetadata(jid);
    const participants = group.participants.map(p => p.id);

    let onlineUsers = [];

    for (const user of participants) {
      try {
        const presence = await sock.presenceSubscribe(user);
        const userPresence = sock.presences[user]?.presence || "unavailable";

        if (userPresence === "available" || userPresence === "composing" || userPresence === "recording") {
          onlineUsers.push(`@${user.split("@")[0]}`);
        }
      } catch (e) {
        // Ignore errors for users that presence not available
      }
    }

    if (onlineUsers.length === 0) {
      await sock.sendMessage(jid, { text: "📶 No members are currently online." });
    } else {
      await sock.sendMessage(jid, {
        text: `📶 Members currently online:\n${onlineUsers.join("\n")}`,
        mentions: onlineUsers.map(u => u.replace("@", "") + "@s.whatsapp.net"),
      });
    }
  },
};
