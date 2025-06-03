export const name = "promote";

export async function execute(sock, msg, from, sender, groupMetadata) {
  const isGroup = from.endsWith("@g.us");
  const isBotAdmin = groupMetadata.participants.find(p => p.id === sock.user.id)?.admin !== null;
  const isUserAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin !== null;
  const reply = (text) => sock.sendMessage(from, { text }, { quoted: msg });

  if (!isGroup || !isUserAdmin || !isBotAdmin) {
    return reply("❌ Bot requires admin privileges to perform this action...");
  }

  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const repliedUser = msg.message?.extendedTextMessage?.contextInfo?.participant;
  const target = mentioned[0] || repliedUser;

  if (!target) return reply("⚠️ Please tag or reply to a user to promote.");

  await sock.groupParticipantsUpdate(from, [target], "promote");
  reply("✅ User promoted to admin.");
}
