/**
 * Feature metadata registration for popup
 * Uses shared feature definitions to stay in sync with content script.
 * Registers features with stub execute functions (no-op) since popup
 * only needs metadata for UI display, not actual feature execution.
 */

import { featureDefinitions } from "./feature-definitions";
import { registerFeature } from "./registry";

// Register all features with stub execute functions for popup metadata
for (const definition of featureDefinitions) {
	registerFeature({
		...definition,
		execute: () => {}, // No-op for metadata-only registration
	});
}
