// commands/kick.js
module.exports = {
  name: "kick",
  description: "Kick a member from the group with a cool GIF",
  async execute(sock, msg, args) {
    try {
      const from = msg.key.remoteJid;
      const isGroup = from.endsWith("@g.us");
      if (!isGroup) return await sock.sendMessage(from, { text: "❌ Command hii inafanya kazi tu kwenye groups." });

      const sender = msg.key.participant || msg.key.remoteJid;
      const metadata = await sock.groupMetadata(from);
      const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
      const botIsAdmin = metadata.participants.find(p => p.id === botNumber)?.admin;

      if (!botIsAdmin) return await sock.sendMessage(from, { text: "⚠️ Mimi si admin, siwezi kick mtu." });

      // Check if sender is admin
      const senderIsAdmin = metadata.participants.find(p => p.id === sender)?.admin || metadata.participants.find(p => p.id === sender)?.admin === "superadmin";
      if (!senderIsAdmin) return await sock.sendMessage(from, { text: "📛 You need to be an admin to kick members." });

      // Extract mentioned user or argument
      let userId;
      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userId = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      } else if (args.length > 0) {
        userId = args[0].includes("@s.whatsapp.net") ? args[0] : `${args[0]}@s.whatsapp.net`;
      } else {
        return await sock.sendMessage(from, { text: `❌ Tafadhali taja mtu wa kukick au toa namba yake.\nMfano: ${PREFIX}kick @user` });
      }

      // Kick user
      await sock.groupParticipantsUpdate(from, [userId], "remove");

      // Send gif with caption
      await sock.sendMessage(from, {
        gif: {
          url: "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif"
        },
        caption: `🚫 User @${userId.split("@")[0]} has been kicked from the group.`,
        mentions: [userId],
      });

    } catch (err) {
      console.error("❌ Kick command error:", err);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Error: ${err.message}` });
    }
  }
};
