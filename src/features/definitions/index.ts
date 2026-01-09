/**
 * Feature Definitions
 *
 * This is the main entry point for all feature definitions.
 * Importing this file registers all features with the registry.
 *
 * To add a new feature:
 * 1. Create a new file in the appropriate context folder (global/, home/, article/)
 * 2. Export the feature definition and call registerFeature()
 * 3. Add an import in that folder's index.ts
 *
 * That's it! The feature will automatically appear in the popup UI
 * and be executed in the content script.
 */

// Import all feature contexts to trigger registration
import "./global";
import "./home";
import "./article";
