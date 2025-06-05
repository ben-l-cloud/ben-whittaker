const axios = require("axios");

const searchGifGoogle = async (query) => {
  const apiKey = "AIzaSyCIDY_QAXl2ZKdJt45aakaTINvJY_YpefM";
  const cx = "73d8709834fb040ad"; // Your CSE ID
  const res = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
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

// Kwenye command ya WhatsApp bot
if (commandName === "gif") {
  const query = args.join(" ") || "funny";
  const gifUrl = await searchGifGoogle(query);
  if (gifUrl) {
    await sock.sendMessage(from, { video: { url: gifUrl }, caption: `🎞️ Here's your GIF for: *${query}*` }, { quoted: msg });
  } else {
    await sock.sendMessage(from, { text: "⚠️ Sorry, no GIF found." }, { quoted: msg });
  }
}
