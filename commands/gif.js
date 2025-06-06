const axios = require("axios");

const searchGifGoogle = async (query) => {
  const apiKey = "AIzaSyCIDY_QAXl2ZKdJt45aakaTINvJY_YpefM";
  const cx = "73d8709834fb040ad";
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

// Hakikisha hii iko ndani ya async function ya message handler
const handleCommand = async (commandName, args, sock, msg, from) => {
  if (commandName === "gif") {
    const query = args.join(" ") || "funny";

    try {
      const gifUrl = await searchGifGoogle(query);
      if (gifUrl) {
        await sock.sendMessage(from, { video: { url: gifUrl }, caption: `🎞️ Here's your GIF for: *${query}*` }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { text: "⚠️ Sorry, no GIF found." }, { quoted: msg });
      }
    } catch (error) {
      console.error("❌ Error fetching gif:", error);
      await sock.sendMessage(from, { text: "⚠️ Kuna shida kutafuta gif." }, { quoted: msg });
    }
  }
};
