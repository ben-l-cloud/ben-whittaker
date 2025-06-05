module.exports = {
  name: "unlockgroup",
  description: "🔓 Unlock the group so everyone can send messages.",
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // Loading message
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
        text: "⛔ *Only group admins can unlock the group.*",
      });
    }

    if (!isBotAdmin) {
      return await sock.sendMessage(jid, {
        text: "🤖 *I need admin rights to unlock the group.*",
      });
    }

    await sock.groupSettingUpdate(jid, 'not_announcement'); // unlock group

    await sock.sendMessage(jid, {
      text: "🔓 *Group unlocked!*\n\nNow everyone can send messages.",
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
