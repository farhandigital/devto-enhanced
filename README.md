# DEV.TO Enhanced

[![Version](https://img.shields.io/badge/version-0.2.0-orange)](https://github.com/InvictusNavarchus/devto-enhanced)
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

## 🏗️ Architecture Overview

The extension is built with performance as a priority, utilizing a **Split Architecture**:

1.  **Instant Popup**: The popup bundle imports *only* feature metadata, ensuring it opens in <50ms.
2.  **Context-Aware Content Script**: The content script handles the heavy lifting, orchestrating features based on the current page type (Home vs Article).
3.  **Feature Registry**: A declarative system where features are defined once and automatically injected where needed.

*See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a deep dive into the bundle splitting strategy and registry system.*

## 🛠️ Quick Start

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
