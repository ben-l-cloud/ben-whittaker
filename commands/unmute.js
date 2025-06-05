module.exports = {
  name: "unmute",
  description: "🔔 Unmute the group (everyone can send)",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Loading..." });

    await sock.groupSettingUpdate(jid, "not_announcement");
    await sock.sendMessage(jid, { text: "🔔 Group has been unmuted. Everyone can now send messages." });
  },
};
