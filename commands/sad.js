{
  name: "sad",
  description: "😔 Send a random sad GIF",
  async execute(sock, msg) {
    const res = await axios.get(`https://tenor.googleapis.com/v2/search?q=sad&key=AIzaSyCIDY_QAXl2ZKdJt45aakaTINvJY_YpefM&limit=1`);
    const gifUrl = res.data.results[0]?.media_formats?.gif?.url;
    await sock.sendMessage(msg.key.remoteJid, { video: { url: gifUrl }, gifPlayback: true, caption: "😔 Feeling sad..." });
  }
}
