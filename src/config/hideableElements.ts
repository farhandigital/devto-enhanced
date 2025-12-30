import { Selectors } from "@/config/selectors";
import type { HideableElement } from "@/types/hideable";
import type { ExtensionSettings } from "@/types/settings";

/**
 * Declarative configuration for all hideable elements
 * To add a new hideable element:
 * 1. Add an entry here
 * 2. Add corresponding CSS in devto.css
 * 3. Add the setting to types.ts
 */
export const HIDEABLE_ELEMENTS: readonly HideableElement[] = [
	// Global elements (visible on all pages)
	{
		selector: Selectors.global.subforemSwitcher,
		settingPath: "global.hideSubforemSwitcher",
		cssClass: "dt-hide-subforem",
		context: "global",
	},

	// Article page elements
	{
		selector: Selectors.layout.rightSidebar,
		settingPath: "article.hideRightSidebar",
		cssClass: "dt-clean-right",
		context: "article",
	},

	// Home page elements
	{
		selector: Selectors.layout.leftSidebar,
		settingPath: "home.hideLeftSidebar",
		cssClass: "dt-clean-left",
		context: "home",
	},
	{
		selector: Selectors.layout.rightSidebar,
		settingPath: "home.hideRightSidebar",
		cssClass: "dt-clean-right",
		context: "home",
	},
] as const;

/**
 * Helper to get setting value from nested path
 */
export function getSettingValue(
	settings: ExtensionSettings,
	path: string,
): boolean {
	const [section, key] = path.split(".") as [keyof ExtensionSettings, string];
	return settings[section][
		key as keyof (typeof settings)[typeof section]
	] as boolean;
}
