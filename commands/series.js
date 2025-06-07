const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "series",
  description: "📺 Tafuta TV Series kutoka 1337x.to (No API)",
  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const query = args.join(" ");
    if (!query) {
      return await sock.sendMessage(jid, { text: "📺 Tafadhali andika jina la series. Mfano:\n!series breaking bad" });
    }

    await sock.sendMessage(jid, { text: `🔍 Inatafuta series: *${query}*...` });

    try {
      const searchUrl = `https://1337x.to/search/${encodeURIComponent(query)}/1/`;
      const res = await axios.get(searchUrl);
      const $ = cheerio.load(res.data);

      const firstResult = $("tr").eq(1); // skip table header
      const title = firstResult.find("td.coll-1 a").eq(1).text();
      const pageLink = "https://1337x.to" + firstResult.find("td.coll-1 a").eq(1).attr("href");
      const seeders = firstResult.find("td.coll-2").text();
      const leechers = firstResult.find("td.coll-3").text();
      const size = firstResult.find("td.coll-4").text();

      const detailsRes = await axios.get(pageLink);
      const $$ = cheerio.load(detailsRes.data);
      const magnetLink = $$('a[href^="magnet:?xt"]').attr("href");

      if (!magnetLink) {
        return await sock.sendMessage(jid, { text: "❌ Hakuna series iliyopatikana." });
      }

      await sock.sendMessage(jid, {
        text: `🎬 *${title}*\n📦 Size: ${size}\n📈 Seeders: ${seeders} | 🧲 Leechers: ${leechers}\n\n🔗 *Magnet Link:*\n${magnetLink}`,
      });

    } catch (e) {
      console.error(e);
      await sock.sendMessage(jid, { text: "⚠️ Kulitokea kosa. Jaribu tena baadaye." });
    }
  }
};
