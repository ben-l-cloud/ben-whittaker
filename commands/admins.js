module.exports = {
  name: "admins",
  description: "👑 List all group admins",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const group = await sock.groupMetadata(jid);
    const admins = group.participants.filter(p => p.admin);

    const list = admins.map((a, i) => `${i + 1}. @${a.id.split("@")[0]}`).join("\n");
    await sock.sendMessage(jid, {
      text: `👑 *Group Admins:*\n\n${list}`,
      mentions: admins.map(a => a.id),
    });
  },
};
