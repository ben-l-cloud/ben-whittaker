const axios = require("axios");

module.exports = {
  name: "weather",
  description: "🌤️ Get current weather info for a city",
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    if (!args.length) {
      const sent = await sock.sendMessage(from, { text: "Please provide a city name!" }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "⚠️", key: sent.key } });
      return;
    }

    const city = args.join(" ");
    const apiKey = "1536f6a7be04b8ad50d09f6228f6ff4e"; // Your API key here
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const weather = response.data;

      const weatherText = 
        `🌤️ Weather in *${weather.name}, ${weather.sys.country}*\n` +
        `Temperature: ${weather.main.temp}°C\n` +
        `Feels like: ${weather.main.feels_like}°C\n` +
        `Humidity: ${weather.main.humidity}%\n` +
        `Condition: ${weather.weather[0].description}\n` +
        `Wind Speed: ${weather.wind.speed} m/s`;

      const sent = await sock.sendMessage(from, { text: weatherText }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "🌤️", key: sent.key } });

    } catch (error) {
      const sent = await sock.sendMessage(from, { text: `❌ Could not find weather data for "${city}". Please check the city name and try again.` }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "❌", key: sent.key } });
    }
  },
};
