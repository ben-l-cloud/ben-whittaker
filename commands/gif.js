const axios = require("axios");

const searchGifGoogle = async (query) => {
  const apiKey = "AIzaSyCIDY_QAXl2ZKdJt45aakaTINvJY_YpefM"; // Google API Key
  const cx = "73d8709834fb040ad"; // Google CSE ID

  const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
    params: {
      key: apiKey,
      cx: cx,
      q: query,
      searchType: "image",
      fileType: "gif",
      safe: "active",
      num: 1
    }
  });

  return res.data.items[0]?.link;
};

module.exports = {
  name: "gif",
  description: "Search a GIF using Google",
  category: "media",
  async execute(sock, msg, args, from, commandName) {
    const query = args.join(" ") || "funny";
    try {
      const gifUrl = await searchGifGoogle(query);
      if (gifUrl) {
        await sock.sendMessage(from, {
          video: { url: gifUrl },
          caption: `🎞️ Here's your GIF for: *${query}*`
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, {
          text: "⚠️ Sorry, no GIF found."
        }, { quoted: msg });
      }
    } catch (err) {
      console.error("GIF Command Error:", err);
      await sock.sendMessage(from, {
        text: "❌ Error while searching for GIF."
      }, { quoted: msg });
    }
  }
};
