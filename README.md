# 🚀 SWIFTBOT - The Ultimate WhatsApp Multi-Device Framework

![SwiftBot Logo](https://i.ibb.co/hxBXBPjD/157c85ac3-logo.png)

Welcome to **SwiftBot**, the next-generation, high-performance WhatsApp bot powered by the latest Baileys library and Node.js. SwiftBot is engineered to provide an unparalleled user experience with top-tier automation, robust database systems, and uncompromised anti-ban features.

---

## 🌟 Key Features

### 🛡️ Iron-Clad Anti-Ban & High Security
- **Smart Connection State Handling**: Prevents spamming login sequences which flag numbers.
- **Fail-Safe Session Closure**: Handles `401`, `428`, `403`, and `405` gracefully to drop connections instantly without aggressive retry looping.
- **Secure Fallback Fallthrough**: Seamless reconnection without corrupting Auth files.

### ⚡ Rapid Multi-Device Architecture
- Complete seamless Multi-Device support using the bleeding-edge WebSockets `@whiskeysockets/baileys`.
- Ultra-low latency response caching.
- Handles Group Chats, DMs, ViewOnce, Videos, Images effortlessly.

### 🎭 Supercharged Commands & Features
- **100+ Built-in Commands**: Includes utility, moderation, downloading, and AI generation.
- **150+ Anime Commands**: `waifu`, `neko`, `shinobu`, `megumin`, `cuddle`, + anime memes (`waifumeme`, `nekomeme` etc.) + anime stickers (`waifusticker`, `nekosticker` etc.)! Heavily extended dynamically with Waifu.pics and Reddit API endpoints, falling back gracefully to a robust pool of **50+ persistent hardcoded image sources per command**! Includes fun randomized statements!
- **Dynamic Group Automations**: Anti-delete, Anti-Link, Ant-Spam, Auto-Mute/Unmute scheduling.

### 📊 Real-Time Analytics & Platform Detection
- Menu command intelligently detects platforms like Render, Railway, Fly.io, Pterodactyl, and VPS.
- Live Real-Time Memory usage visualization (Bar Chart inline).
- Tracks DB Types gracefully (Supabase, MongoDB, or Lightning Local JSON).

---

## 🛠️ Deploying SwiftBot

Deploy SwiftBot completely free with absolutely no hassle on any PaaS or locally!

### Method 1: The One-Click Deploy (Render, Railway, Heroku)
1. Get your `SESSION_ID` by running our separate linking script.
2. Fork this Repository.
3. Add the following to your Environment Variables:
   - `SESSION_ID` -> Paste your linked session ID.
   - `OWNER` -> Your phone number (e.g. 23480000000)
   - `PREFIX` -> `.` or `$` or `!`
   - `MODE` -> `public` or `private`
   - `AUTO_READ_STATUS` -> `true`

### Method 2: Local Installation & VPS

Ensure you have **Node.js 18+** installed on your system.

```bash
# Clone the repository
git clone https://github.com/YourName/SwiftBot.git

# Navigate into the directory
cd SwiftBot

# Install Dependencies
npm install

# Start the bot
npm start
```

*Pro-tip: If using PM2:*
```bash
npx pm2 start index.js --name "swiftbot" --watch
```

---

## 🔧 Configuring Features Dynamically

No more restarting your server for every single change. SwiftBot leverages a lightning-fast key-value database layer meaning your settings are entirely hot-swappable!

- **Settings are persistent** across reboots!
- **Database agnostic** (Scale from memory all the way to cloud-scale Supabase).

---

## 🎨 Theme & Appearance
SwiftBot is crafted around the `createBox` rendering system. Gone are the messy unreadable text outputs. Everything from Connection Logs to the `!menu` are compiled into highly readable, organized console boxes and WhatsApp text blocks.

Enjoy your shiny new Bot!
