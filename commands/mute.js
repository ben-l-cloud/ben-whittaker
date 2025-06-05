module.exports = {
  name: "mute",
  description: "🔕 Mute the group (admins only can send)",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Loading..." });

    await sock.groupSettingUpdate(jid, "announcement");
    await sock.sendMessage(jid, { text: "🔕 Group has been muted. Only admins can send messages." });
  },
};
