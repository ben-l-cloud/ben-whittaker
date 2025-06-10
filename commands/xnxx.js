const puppeteer = require('puppeteer');

module.exports = {
  name: "xnxx",
  description: "🔞 Search and get XNXX direct video",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (!args.length) {
      return sock.sendMessage(from, {
        text: "❗Please enter a search keyword.\nExample: !xnxx school girl"
      }, { quoted: msg });
    }

    const query = args.join(" ");
    const searchUrl = `https://www.xnxx.com/search/${encodeURIComponent(query)}`;

    await sock.sendMessage(from, { react: { text: "🔎", key: msg.key } });

    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });

      const videoPageUrl = await page.evaluate(() => {
        const el = document.querySelector('.thumb a');
        return el ? el.href : null;
      });

      if (!videoPageUrl) {
        await browser.close();
        return sock.sendMessage(from, {
          text: "😢 No results found."
        }, { quoted: msg });
      }

      await page.goto(videoPageUrl, { waitUntil: 'networkidle2' });

      const videoUrl = await page.evaluate(() => {
        const el = document.querySelector('video source');
        return el ? el.src : null;
      });

      const title = await page.evaluate(() => {
        return document.querySelector('h1')?.innerText || 'XNXX Video';
      });

      await browser.close();

      if (!videoUrl) {
        return sock.sendMessage(from, {
          text: "🚫 Failed to fetch video URL."
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        caption: `🎬 ${title}`
      }, { quoted: msg });

    } catch (error) {
      console.error("XNXX ERROR:", error);
      await sock.sendMessage(from, {
        text: "⚠️ An error occurred while fetching the video."
      }, { quoted: msg });
    }
  }
};
