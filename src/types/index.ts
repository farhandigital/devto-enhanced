/**
 * Unified type definitions for the extension
 * Single source of truth for all core types
 */

// =============================================================================
// Page Context Types
// =============================================================================

/**
 * All supported page contexts where features can run
 * To add a new page context, just add it here - the rest is derived
 */
export type PageContext = "global" | "home" | "article" | "other";

/**
 * Page contexts that have dedicated feature groups in the UI
 * (excludes "other" which is just a fallback)
 */
export type FeatureGroupContext = Exclude<PageContext, "other">;

// =============================================================================
// Settings Types
// =============================================================================

/**
 * Extension settings structure
 * Each section corresponds to a page context
 */
export interface ExtensionSettings {
	global: {
		hideSubforemSwitcher: boolean;
	};
	home: {
		hideLeftSidebar: boolean;
		hideRightSidebar: boolean;
	};
	article: {
		hideRightSidebar: boolean;
		moveEngagement: boolean;
		showToC: boolean;
		showReadingStats: boolean;
		showCopyButton: boolean;
		centerArticle: boolean;
	};
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
	global: {
		hideSubforemSwitcher: true,
	},
	home: {
		hideLeftSidebar: true,
		hideRightSidebar: true,
	},
	article: {
		hideRightSidebar: true,
		moveEngagement: true,
		showToC: true,
		showReadingStats: true,
		showCopyButton: true,
		centerArticle: false,
	},
};

// =============================================================================
// Feature Types
// =============================================================================

/**
 * Feature type - whether it hides UI elements or adds functionality
 */
export type FeatureType = "hide" | "add";

/**
 * Setting key reference - points to a specific setting
 * Uses string for key to allow feature definitions without complex type gymnastics
 */
export interface SettingKey {
	section: keyof ExtensionSettings;
	key: string;
}

/**
 * Complete feature definition - single source of truth for a feature
 * Each feature file exports one of these
 */
export interface FeatureDefinition {
	/** Unique identifier for the feature */
	name: string;

	/** Context(s) where this feature should run */
	context: readonly PageContext[];

	/** Feature type - whether it hides UI elements or adds functionality */
	type: FeatureType;

	/** Mapping to setting key path for storage and UI */
	settingKey: SettingKey;

	/** Display label for UI */
	label: string;

	/**
	 * Execute the feature - only loaded in content script bundle
	 * If undefined, the feature is metadata-only (for popup)
	 */
	execute?: (settings: ExtensionSettings) => void;

	/**
	 * CSS class to apply to body when feature is enabled (for hide features)
	 */
	cssClass?: string;

	/**
	 * Custom enabled check - returns true if feature can be toggled
	 * Used for features with dependencies (e.g., centerArticle needs sidebar hidden)
	 */
	isEnabled?: (settings: ExtensionSettings) => boolean;

	/**
	 * Tooltip message when feature is disabled
	 */
	disabledTooltip?: (settings: ExtensionSettings) => string | null;
}

/**
 * Feature metadata for UI display (without execute functions)
 * Automatically derived from FeatureDefinition
 */
export type FeatureMetadata = Pick<
	FeatureDefinition,
	| "name"
	| "context"
	| "type"
	| "settingKey"
	| "label"
	| "isEnabled"
	| "disabledTooltip"
>;

// =============================================================================
// UI Configuration Types
// =============================================================================

/**
 * Feature group for UI display
 */
export interface FeatureGroup {
	context: FeatureGroupContext;
	title: string;
	features: FeatureMetadata[];
}

/**
 * UI context configuration - maps contexts to display titles
 */
export const UI_CONTEXT_TITLES: Record<FeatureGroupContext, string> = {
	global: "Global",
	home: "Homepage",
	article: "Article Page",
};

/**
 * Ordered contexts for consistent UI display
 * If you add a new context to PageContext, you must also add it here.
 *
 * Type safety: The assertion below ensures all FeatureGroupContext values are included.
 * If any context is missing, TypeScript will error.
 */
export const ORDERED_CONTEXTS = ["global", "home", "article"] as const;

// Compile-time check: Ensure ORDERED_CONTEXTS contains all FeatureGroupContext values
// If a context is added to PageContext but not here, this line will fail to compile
const _assertComplete: FeatureGroupContext extends (typeof ORDERED_CONTEXTS)[number]
	? true
	: "ERROR: ORDERED_CONTEXTS is missing some FeatureGroupContext values" = true;
