const fs = require('fs-extra');
const { Sequelize } = require('sequelize');

if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });

const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'BEN-WHITTAKER-SESSION',
    PREFIXE: process.env.PREFIX || "+",
    GITHUB: process.env.GITHUB || 'https://github.com/ben-l-cloud/ben-whittaker',
    OWNER_NAME: process.env.OWNER_NAME || "Ben Whittaker Tech",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "255760317060",

    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTO_REACT: process.env.AUTO_REACTION || "non",

    // 🔥 Picha rasmi ya bot kutoka Telegra.ph
    URL: process.env.URL || "https://telegra.ph/file/cad7038fe82e47f79c609.jpg",

    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'non',
    EMOJIS: process.env.EMOJIS || "🤖,🔥,🌍,💡",
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",
    AUTO_BLOCK: process.env.AUTO_BLOCK || 'no',
    GCF: process.env.GROUP_CONTROL || 'no',
    GREET: process.env.GREET || "no",
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || 'viewed by Ben Whittaker Bot',
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'no',
    AUTOBIO: process.env.AUTOBIO || 'yes',
    ANTICALL_MSG: process.env.ANTICALL_MESSAGE || '',
    GURL: process.env.GURL || "https://whatsapp.com/channel/0029Vb6JhPyBKfhv6j6msk3t",
    EVENTS: process.env.EVENTS || "yes",
    CAPTION: process.env.CAPTION || "BEN-WHITTAKER-BOT",
    BOT: process.env.BOT_NAME || '𝗕𝗘𝗡-𝗪𝗛𝗜𝗧𝗧𝗔𝗞𝗘𝗥-𝗕𝗢𝗧',
    MODE: process.env.PUBLIC_MODE || "no",
    TIMEZONE: process.env.TIMEZONE || "Africa/Dar_es_Salaam",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY || null,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    ETAT: process.env.PRESENCE || '1',
    DP: process.env.STARTING_BOT_MESSAGE || "yes",
    ADM: process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTICALL: process.env.ANTICALL || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "sqlite database used locally"
        : "postgres://user:password@host:port/db_name",
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Imeboreshwa upya: ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
