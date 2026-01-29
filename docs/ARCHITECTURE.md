# Architecture

## Modular Feature System

The extension uses a **modular, self-contained architecture** designed for loose coupling and high cohesion. Each feature is an independent module that defines its own behavior, settings, and UI metadata.

### Core Principles

1.  **Self-Contained Modules**: Every feature resides in its own file (e.g., `features/definitions/article/centerArticle.ts`) and contains everything it needs:
    *   Metadata (name, label, context)
    *   Execution logic (`execute`)
    *   Enable/Disable conditions (`isEnabled`)
    *   UI configuration (`disabledTooltip`)

2.  **Dynamic Registration**: Features register themselves automatically upon import. The `src/features/core/registry.ts` module manages the consolidated list of active features.

3.  **Single Source of Truth**:
    *   **Types**: All core types are consolidated in `src/types/index.ts`.
    *   **Features**: Feature behavior and metadata are defined in *one place* (the feature file), eliminating the need to sync multiple configuration files.

4.  **Automatic UI Generation**: The popup UI is dynamically generated from the registered features. There is no hardcoded UI markup for feature toggles. Grouping and ordering are handled automatically by the registry.

## Directory Structure Strategy

The codebase is organized by **domain/context** rather than technical layer:

*   `src/features/definitions/global/` - Features that apply to the entire site.
*   `src/features/definitions/home/` - Features specific to the homepage.
*   `src/features/definitions/article/` - Features specific to article pages.
*   `src/features/core/` - The engine that powers feature registration and execution.

## Execution Flow

1.  **Initialization**: The content script (`entrypoints/content.ts`) imports the feature definitions barrel file (`features/definitions/index.ts`), triggering the self-registration process.
2.  **Context Detection**: The `PageDetector` utility identifies the current page type (e.g., `article`, `home`).
3.  **Feature selection**: The registry filters features based on the current page context.
4.  **Execution**: The registry executes the `execute()` method of relevant features, passing in the user's settings.
5.  **Reactivity**:
    *   **Settings Changes**: When settings change, the feature re-runs or toggles its state.
    *   **Navigation**: A smart `MutationObserver` detects SPA navigation (Turbo/InstantClick) and re-evaluates the context and active features.

## Feature Types

Features are broadly categorized by how they interact with the page:

*   **`hide` type**: Purely presentational features that toggle CSS classes on the `<body>`.
    *   *Implementation*: Defines an `execute()` function that toggles a CSS class based on the setting. The `cssClass` property serves as metadata/documentation.
    *   *Example*: Hiding the right sidebar.

*   **`add` type**: Functional features that manipulate the DOM or add new elements.
    *   *Implementation*: Defines an `execute()` function that both adds and removes elements based on settings (idempotent pattern).
    *   *Example*: Generating a table of contents or adding a reading time estimate.

## Mutation Observer Strategy

The extension relies on a `MutationObserver` to handle Dev.to's client-side navigation (SPA behavior). To maintain performance:

*   **Smart Filtering**: execution is only triggered by "significant" DOM changes (e.g., main content replacement).
*   **Self-Correction**: Mutations triggered by the extension itself (e.g., injecting the TOC) are ignored to prevent infinite loops.
