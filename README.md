# 📖 RHEMA Daily - Desktop App

> Daily Bible verse notifications for your desktop — built with Electron

[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-blue)](https://github.com/Youngemmy5956/rhema-desktop/releases)
[![Version](https://img.shields.io/badge/version-2.0.0-green)](https://github.com/Youngemmy5956/rhema-desktop/releases/latest)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/Youngemmy5956/rhema-desktop/total)](https://github.com/Youngemmy5956/rhema-desktop/releases)

Created by **Nwamini Emmanuel O.** | [GitHub](https://github.com/Youngemmy5956)

---

## 💡 What is RHEMA?

**RHEMA** (ῥῆμα) is a Greek word meaning **"a spoken word"** or **"utterance"**. In biblical context, it refers to a specific word from God that speaks directly to you in a particular moment.

> *"Man shall not live by bread alone, but by every **word (rhema)** that proceeds from the mouth of God."* — Matthew 4:4

---

## ✨ Features

- 📖 **Daily Bible verse at 8:00 AM** every morning
- 🔔 **Native desktop notifications** with popup dialog
- 🌐 **Live verses** from the entire Bible via API
- 📚 **Multiple Bible versions** (KJV, ASV, WEB)
- 📋 **Copy to clipboard** with one click
- 🖥️ **System tray app** - always available, never intrusive
- ⚙️ **Customizable** notification times
- ✝️ **Offline support** with cached verses

---

## 📥 Download

| Platform | Download |
|----------|----------|
| 🍎 **macOS (Apple Silicon)** | [RHEMA Daily-2.0.0-arm64.dmg](https://github.com/Youngemmy5956/rhema-desktop/releases/download/v2.0.0/RHEMA.Daily-2.0.0-arm64.dmg) |
| 🍎 **macOS (Zip)** | [RHEMA Daily-2.0.0-arm64-mac.zip](https://github.com/Youngemmy5956/rhema-desktop/releases/download/v2.0.0/RHEMA.Daily-2.0.0-arm64-mac.zip) |
| 🪟 **Windows (Installer)** | [RHEMA Daily Setup 2.0.0.exe](https://github.com/Youngemmy5956/rhema-desktop/releases/download/v2.0.0/RHEMA.Daily.Setup.2.0.0.exe) |
| 🪟 **Windows (Portable)** | [RHEMA Daily 2.0.0.exe](https://github.com/Youngemmy5956/rhema-desktop/releases/download/v2.0.0/RHEMA.Daily.2.0.0.exe) |

[**View All Releases**](https://github.com/Youngemmy5956/rhema-desktop/releases) →

---

## 🎯 How It Works

### Installation
1. Download the installer for your platform
2. Install and launch the app
3. **Welcome notification** appears with a sample verse
4. App icon appears in your **system tray** (menu bar on Mac, taskbar on Windows)

### Daily Experience
Every morning at 8:00 AM:
1. 🔔 **Notification** appears with the verse preview
2. 📖 **Popup dialog** shows the full verse
3. ✝️ Click **"Amen"** to close or **"Copy Verse"** to copy to clipboard

### System Tray Menu
Right-click the tray icon to:
- 📖 Show today's verse
- 🔄 Get a new random verse
- ⚙️ Open settings
- ❌ Quit the app

---

## 🚀 Install from Source
```bash
# Clone the repository
git clone https://github.com/Youngemmy5956/rhema-desktop.git
cd rhema-desktop

# Install dependencies
npm install

# Run the app
npm start
```

---

## 🛠️ Build from Source
```bash
# Build for macOS
npm run build:mac

# Build for Windows
npm run build:win

# Build for both platforms
npm run build:all
```

**Build outputs:**
- macOS: `dist/RHEMA Daily-2.0.0-arm64.dmg`
- Windows Installer: `dist/RHEMA Daily Setup 2.0.0.exe`
- Windows Portable: `dist/RHEMA Daily 2.0.0.exe`

---

## ⚠️ macOS Security Note

If macOS blocks the app (because it's not signed with an Apple Developer certificate):

1. Try to open the app
2. Go to **System Settings** → **Privacy & Security**
3. Click **"Open Anyway"**

Or run this command:
```bash
xattr -cr "/Applications/RHEMA Daily.app"
```

---

## 🎨 Screenshots

*Coming soon!*

---

## 🤝 Contributing

We welcome contributions! See our main repo for guidelines:
- [rhema](https://github.com/Youngemmy5956/rhema) - Main CLI project

**Ways to contribute:**
- 🐛 Report bugs
- 💡 Suggest features
- 🎨 Design improvements
- 💻 Code contributions

---

## 🛠️ Tech Stack

- **Electron** - Cross-platform desktop framework
- **Node.js** - Runtime environment
- **Bible API** - Live verse fetching
- **electron-builder** - App packaging

---

## 📋 Requirements

- **macOS:** 10.14 (Mojave) or later
- **Windows:** 10 or later
- **Node.js:** 18.0.0 or later (for building from source)

---

## 🔗 Related Projects

- **[rhema-daily](https://github.com/Youngemmy5956/rhema)** - CLI version for terminal users (npm package)
- **[rhema-desktop](https://github.com/Youngemmy5956/rhema-desktop)** - This desktop app

---

## 👨‍💻 Author

**Nwamini Emmanuel O.**

- GitHub: [@Youngemmy5956](https://github.com/Youngemmy5956)
- npm: [rhema-daily](https://www.npmjs.com/package/rhema-daily)

---

## ⭐ Show Your Support

Give a ⭐️ if this project blessed you!

---

## 📖 Scripture

> *"Your word is a lamp to my feet and a light to my path."*  
> — Psalm 119:105

---

## 📄 License

This project is [MIT](LICENSE) licensed.

---

<p align="center">Made with ❤️ and ✝️ by Nwamini Emmanuel O.</p>
