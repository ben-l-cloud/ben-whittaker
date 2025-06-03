export const name = "group close";

export async function execute(sock, msg, from, sender, groupMetadata) {
  const isGroup = from.endsWith("@g.us");
  const isBotAdmin = groupMetadata.participants.find(p => p.id === sock.user.id)?.admin !== null;
  const isUserAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin !== null;
  const reply = (text) => sock.sendMessage(from, { text }, { quoted: msg });

  if (!isGroup || !isUserAdmin || !isBotAdmin) {
    return reply("❌ Bot requires admin privileges to perform this action...");
  }

  await sock.groupSettingUpdate(from, "announcement");
  reply("🔒 Group has been closed. Only admins can send messages.");
}
