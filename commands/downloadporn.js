const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "downloadporn",
  description: "🔞 Download porn video from Pornhub, Redtube, Xvideos, YouPorn using direct link",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const link = args[0];

    if (!link || !link.startsWith("http")) {
      return sock.sendMessage(from, { text: "❗Send a valid Pornhub/Redtube/Xvideos/YouPorn video link.\n\nExample: !downloadporn https://www.pornhub.com/view_video.php?viewkey=xyz" });
    }

    await sock.sendMessage(from, { react: { text: "🔞", key: msg.key } });

    try {
      const res = await axios.get(link, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const $ = cheerio.load(res.data);

      let videoUrl = null;
      let title = $("title").text().trim();

      // Pornhub
      if (link.includes("pornhub.com")) {
        videoUrl = res.data.match(/"quality_720p":"(https:[^"]+\.mp4)"/)?.[1] ||
                   res.data.match(/"quality_480p":"(https:[^"]+\.mp4)"/)?.[1];
        title = $("h1").text().trim() || title;
      }

      // RedTube
      else if (link.includes("redtube.com")) {
        videoUrl = res.data.match(/"videoUrl":"(https:[^"]+\.mp4)"/)?.[1];
      }

      // Xvideos
      else if (link.includes("xvideos.com")) {
        videoUrl = $("video > source").attr("src");
        if (videoUrl && videoUrl.startsWith("//")) videoUrl = "https:" + videoUrl;
      }

      // YouPorn
      else if (link.includes("youporn.com")) {
        videoUrl = res.data.match(/"videoUrl":"(https:[^"]+\.mp4)"/)?.[1];
      }

      if (!videoUrl) {
        return sock.sendMessage(from, { text: "❌ Unable to extract video URL from link." });
      }

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        caption: `🔞 ${title}`
      }, { quoted: msg });

    } catch (err) {
      console.error("DownloadPorn error:", err.message);
      sock.sendMessage(from, { text: "❌ Error downloading video." });
    }
  }
};
