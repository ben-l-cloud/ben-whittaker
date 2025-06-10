const puppeteer = require('puppeteer');

module.exports = {
  name: "xvideo",
  description: "🔞 Search and get Xvideos direct video",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (!args.length) {
      return sock.sendMessage(from, { text: "❗Tafadhali andika kitu cha kutafuta. Mfano: !xvideo school girl" }, { quoted: msg });
    }

    const query = args.join(" ");
    const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`;

    await sock.sendMessage(from, { react: { text: "🔍", key: msg.key } });

    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });

      // pata link ya kwanza ya video
      const videoPageUrl = await page.evaluate(() => {
        const el = document.querySelector('.thumb-block .thumb a');
        return el ? el.href : null;
      });

      if (!videoPageUrl) {
        await browser.close();
        return sock.sendMessage(from, { text: "😢 Hakuna matokeo yaliyopatikana." }, { quoted: msg });
      }

      await page.goto(videoPageUrl, { waitUntil: 'networkidle2' });

      // pata direct video URL
      const videoUrl = await page.evaluate(() => {
        const el = document.querySelector('video > source');
        return el ? el.src : null;
      });

      const title = await page.title();
      await browser.close();

      if (!videoUrl) {
        return sock.sendMessage(from, { text: "😔 Video URL haikupatikana." }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        caption: `🎬 ${title}`
      }, { quoted: msg });

    } catch (err) {
      console.error("Xvideos error:", err);
      await sock.sendMessage(from, { text: "🚫 Tatizo limetokea wakati wa kuchukua video." }, { quoted: msg });
    }
  }
};
