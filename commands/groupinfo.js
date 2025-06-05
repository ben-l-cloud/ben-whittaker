module.exports = {
  name: "groupinfo",
  description: "Onyesha taarifa za group",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // Ensure it's a group
    if (!jid.endsWith("@g.us")) {
      await sock.sendMessage(jid, {
        text: "❗ Hii command inafanya kazi ndani ya group tu!",
      });
      return;
    }

    // Auto-reaction
    await sock.sendMessage(jid, {
      react: { text: "📊", key: msg.key },
    });

    // Loading...
    await sock.sendMessage(jid, {
      text: "⏳ Getting group info...",
      forwardingScore: 100,
      isForwarded: true,
    });

    try {
      const metadata = await sock.groupMetadata(jid);
      const { id, subject, owner, participants, desc } = metadata;
      const admins = participants.filter((p) => p.admin !== null);
      const groupInfoText = `
👥 *Group Info*
━━━━━━━━━━━━━━━
📛 Name: ${subject}
🆔 ID: ${id}
👑 Owner: ${owner?.split("@")[0] || "Unknown"}
🧑‍🤝‍🧑 Members: ${participants.length}
🛡️ Admins: ${admins.length}
📝 Description:
${desc || "No description set."}
━━━━━━━━━━━━━━━
🔗 Ben Whittaker Tech Bot
      `;

      await sock.sendMessage(jid, {
        text: groupInfoText,
        footer: "Ben Whittaker Tech",
        templateButtons: [
          {
            index: 1,
            urlButton: {
              displayText: "🌐 Website",
              url: "https://ben-whittaker-tech.onrender.com",
            },
          },
        ],
        forwardingScore: 999,
        isForwarded: true,
      });
    } catch (error) {
      await sock.sendMessage(jid, {
        text: "⚠️ Samahani, imeshindikana kupata taarifa za group.",
      });
    }
  },
};
