/**
 * Hideable element type definitions
 * Defines the contract for declarative element hiding
 */

import type { FeatureContext } from "./feature";

/**
 * Configuration for elements that can be hidden via settings
 */
export interface HideableElement {
	/** CSS selector to target */
	selector: string;
	/** Path to the setting that controls this element (e.g., 'global.hideSubforemSwitcher') */
	settingPath: string;
	/** CSS class to apply when hiding is enabled */
	cssClass: string;
	/** Context where this element should be hidden */
	context: Exclude<FeatureContext, "other">;
}
