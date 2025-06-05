module.exports = {
  name: "lockgroup",
  description: "🔒 Lock the group so only admins can send messages.",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // Send loading message
    await sock.sendMessage(jid, {
      text: "🕐 *Loading... Please wait*",
      forwardingScore: 100,
      isForwarded: true,
    });

    const groupMetadata = await sock.groupMetadata(jid);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    const sender = msg.participant || msg.key.participant;
    const isAdmin = admins.includes(sender);

    const isBotAdmin = admins.includes(sock.user.id.split(":")[0] + "@s.whatsapp.net");

    if (!isAdmin) {
      return await sock.sendMessage(jid, {
        text: "⛔ *Only group admins can lock the group.*",
      });
    }

    if (!isBotAdmin) {
      return await sock.sendMessage(jid, {
        text: "🤖 *I need admin rights to lock the group.*",
      });
    }

    await sock.groupSettingUpdate(jid, 'announcement'); // lock group

    await sock.sendMessage(jid, {
      text: "🔐 *Group locked successfully!*\n\nOnly admins can send messages now.",
      footer: "Ben Whittaker Tech",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: "🌍 Visit Website",
            url: "https://ben-whittaker-tech.onrender.com",
          },
        },
      ],
    });
  },
};
