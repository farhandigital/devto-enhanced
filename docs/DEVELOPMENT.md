# Development Guide

This guide covers how to set up your development environment, build the project, and add new features.

## Prerequisites

- [Bun](https://bun.sh) installed on your system
- A Chromium-based browser (Chrome, Edge, Brave) or Firefox

## Setup

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

## Building

```bash
# Build for Chrome/Edge (Manifest V3)
bun run build

# Build for Firefox (Manifest V3)
bun run build:firefox

# Create distributable ZIP packages
bun run zip           # Chrome
bun run zip:firefox   # Firefox
```

## Project Structure

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

## Adding New Features

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
