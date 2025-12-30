/**
 * Feature type definitions
 * Defines the contract for extension features
 */

import type { ExtensionSettings } from "./settings";

/**
 * Feature context type - where a feature should run
 */
export type FeatureContext = "global" | "article" | "home" | "other";

/**
 * Feature type - whether it hides UI elements or adds functionality
 */
export type FeatureType = "hide" | "add";

/**
 * Feature interface for all extension features
 */
export interface Feature {
	/** Unique identifier for the feature */
	name: string;

	/** Context(s) where this feature should run */
	context: readonly FeatureContext[];

	/** Feature type - whether it hides UI elements or adds functionality */
	type: FeatureType;

	/** Mapping to setting key path for UI */
	settingKey: {
		section: keyof ExtensionSettings;
		key: string;
	};

	/** Display label for UI */
	label: string;

	/** Execute the feature with current settings */
	execute: (settings: ExtensionSettings) => void;

	/** Optional cleanup function called when feature is disabled or context changes */
	cleanup?: () => void;
}
