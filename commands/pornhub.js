const puppeteer = require('puppeteer');

module.exports = {
  name: "pornhub",
  description: "🔞 Search and get Pornhub direct video",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (!args.length) {
      return sock.sendMessage(from, {
        text: "❗Please enter a search keyword.\nExample: !pornhub college girl"
      }, { quoted: msg });
    }

    const query = args.join(" ");
    const searchUrl = `https://www.pornhub.com/video/search?search=${encodeURIComponent(query)}`;

    await sock.sendMessage(from, { react: { text: "🔍", key: msg.key } });

    try {
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });

      const videoPageUrl = await page.evaluate(() => {
        const el = document.querySelector('.videoPreviewBg a');
        return el ? 'https://www.pornhub.com' + el.getAttribute('href') : null;
      });

      if (!videoPageUrl) {
        await browser.close();
        return sock.sendMessage(from, { text: "😔 No results found." }, { quoted: msg });
      }

      await page.goto(videoPageUrl, { waitUntil: 'networkidle2' });

      const videoUrl = await page.evaluate(() => {
        const source = document.querySelector('video source');
        return source ? source.src : null;
      });

      const title = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText : "Pornhub Video";
      });

      await browser.close();

      if (!videoUrl) {
        return sock.sendMessage(from, { text: "❌ Failed to get video URL." }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        caption: `🎬 ${title}`
      }, { quoted: msg });

    } catch (err) {
      console.error("Pornhub Error:", err);
      await sock.sendMessage(from, {
        text: "⚠️ Error occurred while fetching video."
      }, { quoted: msg });
    }
  }
};
