# DEV.TO Enhanced

[![Version](https://img.shields.io/badge/version-0.2.0-orange)](https://github.com/InvictusNavarchus/devto-enhanced)
[![License](https://img.shields.io/badge/license-MPL--2.0-green)](https://mozilla.org/MPL/2.0/)
[![Built with WXT](https://img.shields.io/badge/built%20with-WXT-7c3aed)](https://wxt.dev/)

A browser extension that transforms your [dev.to](https://dev.to) reading experience with decluttering tools, enhanced navigation, and other tools.

---

## ✨ Features

All features are **fully toggleable** via the extension popup menu, with preferences automatically persisted to browser storage and synchronized in real-time across tabs.

### 🌐 Global Features

- **Hide Subforem Switcher** — Remove the Subforem navigation menu for a cleaner interface

### 📖 Article Page Features

- **Hide Right Sidebar** — Remove distracting sidebar content to focus on the article
- **Move Engagement Buttons** — Relocate like/comment/save buttons to appear below the article title for easier access
- **Sticky Table of Contents** — Auto-generate a dynamic, scrollspy-enabled table of contents in the right sidebar that:
  - Includes all headings (H1-H6) from the article
  - Highlights the currently active section as you scroll
  - Provides smooth scroll navigation to any section
  - Automatically generates IDs for headings without them
- **Reading Statistics** — Display word count and estimated reading time (based on 225 WPM) below the article title
- **Copy Article Button** — One-click button to copy the entire article in Markdown format, including:
  - Formatted text with proper heading levels
  - Code blocks with syntax preservation
  - Lists (ordered and unordered)
  - Links, bold, italic, and inline code
  - Author attribution and article URL
- **Center Article** — Center the article content when sidebars are hidden (requires right sidebar hidden AND ToC disabled)

### 🏠 Homepage Features

- **Hide Left Sidebar** — Remove the left navigation sidebar for a cleaner feed view
- **Hide Right Sidebar** — Remove the right sidebar for a distraction-free browsing experience

## 🎯 How It Works

The extension uses a feature registry system to:

1. **Apply CSS-based Layouts** — Dynamically toggle CSS classes on the document body to hide/show elements based on page context
2. **Inject Dynamic Features** — Render UI enhancements (ToC, reading stats, copy button) directly into the page DOM
3. **Handle SPA Navigation** — Monitor DOM changes and URL transitions to re-apply features when navigating between pages (dev.to uses SPA-style navigation)

## 📥 Installation

> [!IMPORTANT]
> Chrome/Edge and Firefox: Not yet available on official extension stores. Use the manual installation steps below.

<details>
<summary>Click for manual installation instructions</summary>

### Download from GitHub Releases

#### For Google Chrome/Edge:

1. Download the latest Chrome extension package from [GitHub Releases](https://github.com/farhandigital/devto-enhanced/releases/latest)
2. Extract the downloaded ZIP file to a folder on your computer.
3. Open Chrome/Edge and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (toggle in the top right).
5. Click on **Load unpacked**.
6. Select the extracted folder containing the extension files.

#### For Mozilla Firefox:

1. Download the latest Firefox extension package from [GitHub Releases](https://github.com/farhandigital/devto-enhanced/releases/latest)
2. Extract the downloaded ZIP file to a folder on your computer.
3. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
4. Click on **Load Temporary Add-on...**.
5. Select the `manifest.json` file located inside the extracted folder.

The extension icon should now appear in your browser's toolbar.

</details>

## 💻 Tech Stack

- **[WXT](https://wxt.dev/)** — Cross-browser extension framework
- **[Svelte 5](https://svelte.dev/)** — Lightweight reactive UI framework
- **TypeScript** — Type-safe development
- **Bun** — Fast JavaScript runtime and package manager

## 🛠️ Development

<details>
<summary>Click to see development guide</summary>

### Prerequisites

- [Bun](https://bun.sh) installed on your system
- A Chromium-based browser (Chrome, Edge, Brave) or Firefox

### Setup

```bash
# Clone the repository
git clone https://github.com/farhandigital/devto-enhanced.git
cd devto-enhanced

# Install dependencies
bun install

# Start development server with hot reload (Chrome)
bun run dev

# Start development server for Firefox
bun run dev:firefox
```

### Building

```bash
# Build for Chrome/Edge (Manifest V3)
bun run build

# Build for Firefox (Manifest V3)
bun run build:firefox

# Create distributable ZIP packages
bun run zip           # Chrome
bun run zip:firefox   # Firefox
```

### Project Structure

```bash
src/
├── assets/              # Static assets (icons, images)
├── config/              # Configuration files
│   └── hideableElements.ts  # Declarative configuration for hideable elements
├── entrypoints/         # Extension entry points
│   ├── content.ts       # Main content script
│   ├── devto.css        # Injected styles
│   └── popup/           # Extension popup UI (Svelte)
└── utils/               # Utility modules
    ├── featureRegistry.ts    # Feature orchestration system
    ├── pageDetector.ts       # Page type detection
    ├── selectors.ts          # Centralized DOM selectors
    ├── storage.ts            # Storage management with watchers
    ├── types.ts              # TypeScript type definitions
    └── features/             # Individual feature implementations
        ├── articleActionMover.ts
        ├── articleCentering.ts
        ├── copyArticle.ts
        ├── layoutCleaner.ts
        ├── readingStats.ts
        ├── tocGenerator.ts
        └── index.ts          # Feature registration
```

### Adding New Features

The extension uses a declarative feature registry system. To add a new feature:

1. **Create the feature implementation** in `src/utils/features/yourFeature.ts`:

```typescript
export function yourFeature(settings: ExtensionSettings) {
  // Your feature logic here
}
```

2. **Register the feature** in `src/utils/features/index.ts`:

```typescript
registerFeature({
  name: 'yourFeatureName',
  context: ['article'], // or ['home', 'global']
  type: 'add', // or 'hide'
  settingKey: { section: 'article', key: 'enableYourFeature' },
  label: 'Your Feature Label',
  execute: yourFeature,
});
```

3. **Add the setting** to `src/utils/types.ts`:

```typescript
export interface ExtensionSettings {
  article: {
    // ... existing settings
    enableYourFeature: boolean;
  };
}
```

4. **Add CSS** (if needed) to `src/entrypoints/devto.css`

The feature will automatically appear in the popup UI and execute on the appropriate pages!

</details>

## 🏗️ Architecture

<details>
<summary>Click to see architecture</summary>

### Feature Registry System

The extension uses a centralized feature registry that enables:

- **Declarative feature definitions** — Register features with metadata (name, context, type, settings)
- **Automatic orchestration** — Features are executed based on page context without manual coordination
- **Type-safe settings** — Full TypeScript support for all feature configurations
- **Dynamic UI generation** — Popup interface is automatically generated from registered features

### Context-Aware Execution

Features are registered with specific contexts:

- **Global** — Execute on all dev.to pages
- **Article** — Execute only on article pages
- **Home** — Execute only on the homepage

### Mutation Observer with Smart Filtering

The content script uses a MutationObserver to detect SPA navigation, but includes intelligent filtering to:

- Ignore mutations from the extension's own injected elements
- Only react to significant DOM changes (page transitions)
- Prevent infinite loops from self-triggered mutations
- Skip irrelevant changes (ads, lazy-loaded content)

### CSS-First Approach for Layout Changes

Layout modifications (hiding sidebars, centering content) are implemented primarily through CSS classes toggled on the `<body>` element. This provides:

- **Better performance** — No DOM manipulation for simple visibility changes
- **Smooth transitions** — CSS animations for better UX
- **Maintainability** — Centralized styles in `devto.css`

</details>

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. **Fork the repository** and create a new branch for your feature/fix
2. **Test thoroughly** — Test on both Chrome and Firefox if possible
3. **Use conventional commits** — Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
4. **Submit a Pull Request** with a clear description of your changes

### Reporting Issues

When reporting bugs, please include:

- Browser and extension version
- Steps to reproduce the issue
- Expected vs actual behavior
- Console errors (if any)

## 📝 License

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
