const puppeteer = require('puppeteer');

module.exports = {
  name: "redtube",
  description: "🔞 Search and get full video from RedTube",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    if (!args.length) {
      return sock.sendMessage(from, { text: "❗Type a search term. Example: !redtube milf" });
    }

    const query = args.join(" ");
    const url = `https://www.redtube.com/?search=${encodeURIComponent(query)}`;

    await sock.sendMessage(from, { react: { text: "🔞", key: msg.key } });

    try {
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      const videoPage = await page.evaluate(() => {
        const link = document.querySelector('.video-thumb a');
        return link ? 'https://www.redtube.com' + link.getAttribute('href') : null;
      });

      if (!videoPage) {
        await browser.close();
        return sock.sendMessage(from, { text: "❌ No results found." });
      }

      await page.goto(videoPage, { waitUntil: 'networkidle2' });

      const videoUrl = await page.evaluate(() => {
        const video = document.querySelector('video source');
        return video ? video.src : null;
      });

      const title = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText.trim() : "RedTube Video";
      });

      await browser.close();

      if (!videoUrl) return sock.sendMessage(from, { text: "⚠️ Couldn't get video link." });

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        caption: `🔞 ${title}`
      }, { quoted: msg });

    } catch (err) {
      console.error("RedTube Error:", err);
      await sock.sendMessage(from, { text: "❌ An error occurred while fetching video." });
    }
  }
};
