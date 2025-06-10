const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "xvideo",
  description: "🔞 Search Xvideos and return thumbnails only",
  async execute(sock, msg, args) {
    await sock.sendMessage(msg.key.remoteJid, {
      react: {
        text: "🔞",
        key: msg.key,
      },
    });

    if (!args.length) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Please enter a search keyword. Example: school girl" });
    }

    const query = args.join(" ");
    const res = await axios.get(`https://www.xvideos.com/?k=${encodeURIComponent(query)}`);
    const $ = cheerio.load(res.data);
    const results = [];

    $("div.thumb-block").each((i, el) => {
      if (i >= 5) return false; // Limit to 5 results
      
      // Find thumbnail image url
      let thumb = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
      
      // Some images might have "//..." url, add https:
      if (thumb && thumb.startsWith("//")) thumb = "https:" + thumb;

      if (thumb) results.push(thumb);
    });

    if (!results.length) {
      return sock.sendMessage(msg.key.remoteJid, { text: "No results found." });
    }

    // Send images one by one as media messages
    for (const imageUrl of results) {
      await sock.sendMessage(msg.key.remoteJid, { image: { url: imageUrl }, caption: "🔞 Xvideos thumbnail" });
    }
  },
};
