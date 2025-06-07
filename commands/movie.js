const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "movie",
  description: "🎥 Tafuta movie kwa jina kutoka yts.mx na upate download link (no API)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const query = args.join(" ");
    if (!query) {
      return await sock.sendMessage(jid, { text: "📽️ Tafadhali andika jina la movie. Mfano:\n!movie john wick" });
    }

    await sock.sendMessage(jid, { text: `🔍 Inatafuta movie: *${query}*...` });

    try {
      const searchURL = `https://yts.mx/browse-movies/${encodeURIComponent(query)}/all/all/0/latest`;
      const res = await axios.get(searchURL);
      const $ = cheerio.load(res.data);

      const firstMovie = $(".browse-movie-wrap").first();
      const title = firstMovie.find(".browse-movie-title").text();
      const year = firstMovie.find(".browse-movie-year").text();
      const quality = firstMovie.find(".browse-movie-tags").text().trim();
      const link = firstMovie.find("a.browse-movie-link").attr("href");

      if (!link) {
        return await sock.sendMessage(jid, { text: "❌ Samahani, hakuna movie iliyopatikana." });
      }

      const moviePage = await axios.get(link);
      const $$ = cheerio.load(moviePage.data);

      const torrentLink = $$(".download-torrent a").first().attr("href");
      const poster = $$(".hidden-xs img").first().attr("src");

      await sock.sendMessage(jid, {
        image: { url: poster },
        caption: `🎬 *${title}* (${year})\n📥 Quality: ${quality}\n\n🔗 *Download Link:*\n${torrentLink}`,
      });

    } catch (e) {
      console.error(e);
      await sock.sendMessage(jid, { text: "⚠️ Kulitokea kosa kutafuta movie. Jaribu tena baadaye." });
    }
  }
};
