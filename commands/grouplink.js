module.exports = {
  name: "grouplink",
  description: "🔗 Get group invite link",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    await sock.sendMessage(jid, { text: "🕐 Loading..." });

    const code = await sock.groupInviteCode(jid);
    const link = `https://chat.whatsapp.com/${code}`;
    await sock.sendMessage(jid, {
      text: `🔗 *Group Invite Link*\n${link}`,
    });
  },
};
