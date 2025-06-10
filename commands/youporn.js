const puppeteer = require('puppeteer');

module.exports = {
  name: "youporn",
  description: "🔞 Search and get full video from YouPorn",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    if (!args.length) return sock.sendMessage(from, { text: "❗Type a keyword. Example: !youporn teen" });

    const query = args.join(" ");
    const url = `https://www.youporn.com/search/${encodeURIComponent(query)}`;

    await sock.sendMessage(from, { react: { text: "🔍", key: msg.key } });

    try {
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      const videoPage = await page.evaluate(() => {
        const link = document.querySelector('.video-thumb-info__name a');
        return link ? 'https://www.youporn.com' + link.getAttribute('href') : null;
      });

      if (!videoPage) return sock.sendMessage(from, { text: "❌ No videos found." });

      await page.goto(videoPage, { waitUntil: 'networkidle2' });

      const videoUrl = await page.evaluate(() => {
        const source = document.querySelector('video source');
        return source ? source.src : null;
      });

      const title = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText : "YouPorn Video";
      });

      await browser.close();

      if (!videoUrl) return sock.sendMessage(from, { text: "⚠️ Couldn't get the video URL." });

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        caption: `🔞 ${title}`
      }, { quoted: msg });

    } catch (err) {
      console.error("YouPorn error:", err);
      await sock.sendMessage(from, { text: "❌ Error occurred while fetching video." });
    }
  }
};
