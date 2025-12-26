# DEV.TO Enhanced

A browser extension that enhances your reading experience on [dev.to](https://dev.to) by removing distractions, adding helpful navigation features, and providing reading insights.

## Features

### Article Pages
- **Hide Sidebars** — Remove left and right sidebars to focus on content
- **Move Engagement Buttons** — Relocate like/comment buttons near the article title for easier access
- **Table of Contents** — Auto-generate a sticky table of contents from article headings
- **Reading Stats** — Display word count and estimated reading time

### Homepage
- **Hide Sidebars** — Declutter the homepage feed

## How It Works

The extension injects CSS and JavaScript into dev.to pages to:
1. Apply layout modifications via CSS classes
2. Dynamically render UI enhancements (ToC, stats)
3. Monitor page navigation (dev.to uses SPA-style navigation) and re-apply features as needed

All features are **toggleable** via the popup settings menu, with preferences persisted to browser storage.

## Tech Stack

- **[WXT](https://wxt.dev/)** — Cross-browser extension framework
- **[Svelte 5](https://svelte.dev/)** — Lightweight reactive UI framework
- **TypeScript** — Type-safe development
- **Bun** — Fast JavaScript runtime and package manager

## Development

```bash
# Install dependencies
bun install

# Start dev server (Chrome)
bun run dev

# Build for Firefox (MV3)
bun run build:firefox

# Create distributable ZIP
bun run zip
```

## Building

- Chrome: `bun run build`
- Firefox: `bun run build:firefox`

## License

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.