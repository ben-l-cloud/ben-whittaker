# Ben Whittaker Tech Bot Session Generator

![Ommy Logo](public/ommy.png)

### Description
This app allows users to generate WhatsApp session files by scanning a QR code, then automatically sends their session zip file via WhatsApp. Useful for deploying WhatsApp bots.

### Features
- Generate WhatsApp session ZIP files via QR code scan.
- Automatically send session ZIP via WhatsApp.
- Modern UI with animated header and branding.
- Temporary session storage with automatic cleanup.

### Usage
1. Run `npm install`
2. Start server with `npm start`
3. Open `http://localhost:3000` in your browser.
4. Enter your WhatsApp number (e.g. 255760317060).
5. Scan the displayed QR code with WhatsApp on your phone.
6. Receive session ZIP file directly on WhatsApp.
7. Use the session files to deploy your WhatsApp bot.

### Folder structure
- `sessions/` (stores sessions per user temporarily)
- `public/` (contains static assets including `ommy.png`)
- `index.js` (main server)
- `package.json`
- `.gitignore`

### Notes
- Sessions are deleted after 1 minute post generation.
- For production, add rate limiting and security checks.
- Host on Render, Railway, or any Node.js supported hosting.

### Contact
Email: whittakerben70@gmail.com  
GitHub: [ben-l-cloud/ben-whittaker](https://github.com/ben-l-cloud/ben-whittaker.git)
