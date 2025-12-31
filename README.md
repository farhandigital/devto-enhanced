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
│   └── icon.png         # Extension icon
├── config/              # Configuration files
│   ├── hideableElements.ts  # Declarative configuration for hideable elements
│   └── selectors.ts     # DOM selector constants
├── entrypoints/         # Extension entry points
│   ├── content.ts       # Main content script
│   ├── devto.css        # Injected styles
│   └── popup/           # Extension popup UI (Svelte)
│       ├── App.svelte   # Main popup component
│       ├── app.css      # Popup styles
│       ├── index.html   # Popup HTML entry
│       └── main.ts      # Popup initialization
├── features/            # Feature System
│   ├── feature-definitions.ts # Shared feature metadata (content script)
│   ├── metadata.ts      # Feature metadata (popup - duplicated for perf)
│   ├── index.ts         # Feature registration with implementations
│   ├── registry.ts      # Core registry logic
│   ├── articleActionMover.ts   # Move engagement buttons feature
│   ├── articleCentering.ts     # Center article content feature
│   ├── copyArticle.ts          # Copy article as Markdown feature
│   ├── layoutCleaner.ts        # Hide sidebars/elements feature
│   ├── readingStats.ts         # Reading time/word count feature
│   └── tocGenerator.ts         # Table of contents feature
├── types/               # TypeScript Definitions
│   ├── feature.ts       # Feature type definitions
│   ├── hideable.ts      # Hideable element type definitions
│   └── settings.ts      # Settings type definitions
└── utils/               # Utility modules
    ├── pageDetector.ts  # Page type detection
    └── storage.ts       # Storage management
```

### Adding New Features

The extension uses a declarative feature registry system with a split between metadata and implementation to optimize popup performance. To add a new feature:

1. **Define the Metadata**:

   Add the definition to **BOTH** `src/features/feature-definitions.ts` (for content script) and `src/features/metadata.ts` (for popup).

   > **Note**: Metadata must be manually duplicated in `metadata.ts` to keep the popup bundle completely decoupled and instant.

   ```typescript
   {
    name: "yourFeature",
    context: ["article"], // or ["home", "global"]
    type: "add", // or "hide"
    settingKey: { section: "article", key: "yourFeature" },
    label: "Your Feature Label",
   },
   ```

2. **Create the Implementation** in `src/features/yourFeature.ts`:

```typescript
export function handleYourFeature(settings: ExtensionSettings) {
  // Your feature logic here
}
```

3. **Register the Implementation** in `src/features/index.ts`:

```typescript
// Import your function
import { handleYourFeature } from "./yourFeature";

// Add to the executeMap
const executeMap: Record<string, (settings: ExtensionSettings) => void> = {
  // ...
  yourFeature: handleYourFeature,
};
```

4. **Add the Type Definitions** in `src/types/settings.ts`:

```typescript
export interface ExtensionSettings {
  article: {
    // ... existing settings
    yourFeature: boolean;
  };
}
```

The feature will now automatically appear in the popup (using metadata) and execute in the content script (using the implementation)!

</details>

## 🏗️ Architecture

<details>
<summary>Click to see architecture</summary>

### Feature Registry System

The extension uses a centralized feature registry with a performance-optimized split architecture:

- **Declarative feature definitions** — Features are defined with metadata (name, context, type, settings) in two locations:
  - `feature-definitions.ts` — Used by the content script for feature execution
  - `metadata.ts` — Duplicate metadata used exclusively by the popup for instant UI rendering
- **Automatic orchestration** — Features are executed based on page context without manual coordination
- **Type-safe settings** — Full TypeScript support for all feature configurations via `types/settings.ts`
- **Dynamic UI generation** — Popup interface is automatically generated from registered features in `metadata.ts`

### Performance-Optimized Bundle Splitting

To ensure the popup opens **instantly** (<50ms), the codebase maintains a strict separation:

- **Popup Bundle** (`entrypoints/popup/`)
  - Only imports `features/metadata.ts` (lightweight metadata definitions)
  - Never imports feature implementations or heavy dependencies
  - Renders UI and manages toggle states via browser storage
  
- **Content Script Bundle** (`entrypoints/content.ts`)
  - Imports `features/index.ts` (full feature registry with implementations)
  - Executes feature logic based on page context and user settings
  - Monitors DOM changes and handles SPA navigation

**Trade-off**: Feature metadata is manually duplicated between `feature-definitions.ts` and `metadata.ts` to maintain this performance boundary. This intentional coupling prevents the popup from importing any feature implementation code.

### Context-Aware Execution

Features are registered with specific contexts:

- **Global** — Execute on all dev.to pages
- **Article** — Execute only on article pages (`/*/`)
- **Home** — Execute only on the homepage (`/`)

The `pageDetector.ts` utility determines the current page type, and the registry executes only relevant features.

### Feature Types

Features are categorized by their implementation approach:

- **`hide` type** — CSS-based layout modifications (toggle body classes)
  - Examples: Hide sidebars, hide subforem switcher
  - Implemented via `layoutCleaner.ts` using `hideableElements.ts` config
  
- **`add` type** — DOM injection and dynamic UI enhancements
  - Examples: Table of contents, reading stats, copy article button
  - Each feature has its own implementation file (e.g., `tocGenerator.ts`)

### Mutation Observer with Smart Filtering

The content script uses a MutationObserver to detect SPA navigation, with intelligent filtering to:

- Ignore mutations from the extension's own injected elements (via `data-devto-enhanced` attributes)
- Only react to significant DOM changes (page transitions)
- Prevent infinite loops from self-triggered mutations
- Skip irrelevant changes (ads, lazy-loaded content)

### CSS-First Approach for Layout Changes

Layout modifications (hiding sidebars, centering content) are implemented primarily through CSS classes toggled on the `<body>` element. This provides:

- **Better performance** — No DOM manipulation for simple visibility changes
- **Smooth transitions** — CSS animations for better UX
- **Maintainability** — Centralized styles in `devto.css`
- **Declarative configuration** — Hideable elements defined in `config/hideableElements.ts`

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
