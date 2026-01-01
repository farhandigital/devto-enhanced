# dev.to Enhanced

[![Version](https://img.shields.io/badge/version-0.3.0-orange)](https://github.com/InvictusNavarchus/devto-enhanced)
[![License](https://img.shields.io/badge/license-MPL--2.0-green)](https://mozilla.org/MPL/2.0/)
[![Built with WXT](https://img.shields.io/badge/built%20with-WXT-7c3aed)](https://wxt.dev/)

A browser extension that transforms your [dev.to](https://dev.to) reading experience with decluttering tools, enhanced navigation, and other tools.

---

## ✨ Features

All features are **fully toggleable** via the extension popup menu.

### 🧹 Decluttering
- **Global** — Hide the Subforem switcher for a cleaner interface.
- **Homepage** — Remove left and right sidebars to focus on the feed.
- **Article** — Remove sidebars, center the content, and relocate engagement buttons.

### 📖 Article Enhancements
- **Sticky Table of Contents** — Auto-generated, scrollspy-enabled ToC for easy navigation.
- **Reading Statistics** — Display word count and estimated reading time.
- **Copy Article** — One-click copy to Markdown with full formatting preservation.

*For a detailed breakdown of every feature's capabilities, see [docs/FEATURES.md](docs/FEATURES.md).*

### 📥 Installation

#### Mozilla Firefox

[![Firefox Add-on](https://img.shields.io/badge/Firefox-Available-orange?logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/devto-enhanced/)

Install directly from [Firefox Add-ons (AMO)](https://addons.mozilla.org/en-US/firefox/addon/devto-enhanced/)

#### Google Chrome/Edge

> [!IMPORTANT]
> Not yet available on official extension stores. Use the manual installation steps below.

<details>
<summary>Click for manual installation instructions</summary>

### Download from GitHub Releases

#### For Google Chrome/Edge:

1. Download the latest Chrome extension package from [GitHub Releases](https://github.com/InvictusNavarchus/udemy-show-release-date/releases/latest)
2. Extract the downloaded ZIP file to a folder on your computer.
3. Open Chrome/Edge and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (toggle in the top right).
5. Click on **Load unpacked**.
6. Select the extracted folder containing the extension files.

#### For Mozilla Firefox:

1. Download the latest Firefox extension package from [GitHub Releases](https://github.com/InvictusNavarchus/udemy-show-release-date/releases/latest)
2. Extract the downloaded ZIP file to a folder on your computer.
3. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
4. Click on **Load Temporary Add-on...**.
5. Select the `manifest.json` file located inside the extracted folder.

The extension icon should now appear in your browser's toolbar.

</details>

## 🛠️ Quick Dev

**Prerequisites**: [Bun](https://bun.sh) and a Chromium or Firefox browser.

```bash
# 1. Install dependencies
bun install

# 2. Start development server (Chrome)
bun run dev

# 3. Build for production
bun run build
```

*For specific guides on adding new features and the full project structure, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).*


## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started

### Reporting Issues

When reporting bugs, please include:

- Browser and extension version
- Steps to reproduce the issue
- Expected vs actual behavior
- Console errors (if any)

## 📝 License

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
