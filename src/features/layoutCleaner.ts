/**
 * Layout Cleaner Feature
 * Handles hiding/showing UI elements based on settings
 */

import { getSettingValue, HIDEABLE_ELEMENTS } from "@/config/hideableElements";
import type { ExtensionSettings } from "@/types/settings";
import { PageDetector } from "@/utils/pageDetector";

/**
 * Toggles CSS classes on the body to hide/show elements based on settings
 * Uses declarative configuration from HIDEABLE_ELEMENTS
 */
export function applyLayoutCleaning(settings: ExtensionSettings) {
	const pageType = PageDetector.getPageType();

	// Track which CSS classes should be applied in this context
	// This prevents removing classes that were just applied by other entries
	const appliedClasses = new Set<string>();

	// First pass: apply classes for matching contexts
	HIDEABLE_ELEMENTS.forEach((element) => {
		const shouldApply =
			element.context === "global" || element.context === pageType;

		if (shouldApply) {
			const isEnabled = getSettingValue(settings, element.settingPath);
			document.body.classList.toggle(element.cssClass, isEnabled);
			if (isEnabled) {
				appliedClasses.add(element.cssClass);
			}
		}
	});

	// Second pass: remove classes for non-matching contexts
	// But only if they weren't applied in the first pass
	HIDEABLE_ELEMENTS.forEach((element) => {
		const shouldApply =
			element.context === "global" || element.context === pageType;

		if (!shouldApply && !appliedClasses.has(element.cssClass)) {
			// Remove class if not in the correct context AND wasn't applied
			document.body.classList.remove(element.cssClass);
		}
	});
}
