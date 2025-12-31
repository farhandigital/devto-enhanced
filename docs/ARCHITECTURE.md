# Architecture

## Feature Registry System

The extension uses a centralized feature registry with a performance-optimized split architecture:

- **Declarative feature definitions** — Features are defined with metadata (name, context, type, settings) in two locations:
  - `feature-definitions.ts` — Used by the content script for feature execution
  - `metadata.ts` — Duplicate metadata used exclusively by the popup for instant UI rendering
- **Automatic orchestration** — Features are executed based on page context without manual coordination
- **Type-safe settings** — Full TypeScript support for all feature configurations via `types/settings.ts`
- **Dynamic UI generation** — Popup interface is automatically generated from registered features in `metadata.ts`

## Performance-Optimized Bundle Splitting

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

## Context-Aware Execution

Features are registered with specific contexts:

- **Global** — Execute on all dev.to pages
- **Article** — Execute only on article pages (`/*/`)
- **Home** — Execute only on the homepage (`/`)

The `pageDetector.ts` utility determines the current page type, and the registry executes only relevant features.

## Feature Types

Features are categorized by their implementation approach:

- **`hide` type** — CSS-based layout modifications (toggle body classes)
  - Examples: Hide sidebars, hide subforem switcher
  - Implemented via `layoutCleaner.ts` using `hideableElements.ts` config
  
- **`add` type** — DOM injection and dynamic UI enhancements
  - Examples: Table of contents, reading stats, copy article button
  - Each feature has its own implementation file (e.g., `tocGenerator.ts`)

## Mutation Observer with Smart Filtering

The content script uses a MutationObserver to detect SPA navigation, with intelligent filtering to:

- Ignore mutations from the extension's own injected elements (via `data-devto-enhanced` attributes)
- Only react to significant DOM changes (page transitions)
- Prevent infinite loops from self-triggered mutations
- Skip irrelevant changes (ads, lazy-loaded content)

## CSS-First Approach for Layout Changes

Layout modifications (hiding sidebars, centering content) are implemented primarily through CSS classes toggled on the `<body>` element. This provides:

- **Better performance** — No DOM manipulation for simple visibility changes
- **Smooth transitions** — CSS animations for better UX
- **Maintainability** — Centralized styles in `devto.css`
- **Declarative configuration** — Hideable elements defined in `config/hideableElements.ts`
