# Development Guide

This guide covers how to set up your development environment, build the project, and add new features using the modular architecture.

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
├── assets/                  # Static assets (icons)
├── config/                  # Configuration
│   └── selectors.ts         # Centralized CSS selectors
├── entrypoints/             # Extension Entry Points
│   ├── content.ts           # Main content script
│   ├── devto.css            # Global injected styles
│   └── popup/               # Popup UI (Svelte)
│       └── App.svelte       # Dynamic UI renderer
├── features/                # Modular Feature System
│   ├── core/                # Core engine
│   │   └── registry.ts      # Feature registration & execution logic
│   └── definitions/         # Feature Modules (The "Features")
│       ├── index.ts         # Main entry point
│       ├── global/          # Global features (e.g. hide subforem)
│       ├── home/            # Homepage features (e.g. hide sidebars)
│       └── article/         # Article features (e.g. TOC, reading stats)
├── types/                   # Unified Type Definitions
│   └── index.ts             # Single source of truth for types
└── utils/                   # Utilities
    ├── pageDetector.ts      # Page context detection
    └── storage.ts           # Settings storage
```

## Adding New Features

The new architecture makes adding features extremely simple. You no longer need to touch registry files, metadata files, or the popup UI code.

### Step 1: Create the Feature Module

Create a new file in `src/features/definitions/[context]/`. For example `src/features/definitions/article/myNewFeature.ts`.

```typescript
import { registerFeature } from "@/features/core/registry";
import type { FeatureDefinition, ExtensionSettings } from "@/types";

const feature: FeatureDefinition = {
  name: "myNewFeature",
  label: "My New Feature",
  context: ["article"],
  type: "add", // or "hide"
  settingKey: { section: "article", key: "myNewFeature" },
  
  // Optional: Only allow enabling if another setting is true
  isEnabled: (settings) => settings.article.hideRightSidebar,
  
  // Optional: Tooltip to show when disabled
  disabledTooltip: (settings) => 
    !settings.article.hideRightSidebar ? "Requires hidden sidebar" : null,

  // The logic to run
  execute: (settings: ExtensionSettings) => {
    console.log("My feature is running!");
    // Your DOM manipulation here
  },
  
  // Cleanup logic (optional)
  cleanup: () => {
    // Remove elements or listeners
  }
};

registerFeature(feature);

export default feature;
```

### Step 2: Register the Module

Add a simple import to the index file in your context folder (e.g., `src/features/definitions/article/index.ts`):

```typescript
import "./myNewFeature";
```

### Step 3: Add Settings Type (If needed)

If your feature introduces a *new* setting key that doesn't exist yet, add it to `src/types/index.ts`:

```typescript
export interface ExtensionSettings {
  article: {
    // ... existing settings
    myNewFeature: boolean; // Add this
  };
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  article: {
    // ...
    myNewFeature: true, // Add default
  },
};
```

**That's it!** 
The feature will now:
1.  Automatically appear in the Popup UI under the correct section.
2.  Be persisted in storage.
3.  Execute automatically on the correct pages.
