/**
 * Feature definitions (metadata only)
 * Single source of truth for feature metadata used by both:
 * - index.ts (with real execute functions for content script)
 * - metadata.ts (with stub execute functions for popup)
 *
 * This prevents metadata drift between popup and content script bundles.
 */

import type { FeatureContext, FeatureType } from "@/types/feature";
import type { ExtensionSettings } from "@/types/settings";

/**
 * Feature definition without execute function
 * Used as the base for both popup metadata and content script features
 */
export interface FeatureDefinition {
	name: string;
	context: readonly FeatureContext[];
	type: FeatureType;
	settingKey: {
		section: keyof ExtensionSettings;
		key: string;
	};
	label: string;
}

/**
 * All feature definitions
 * Add new features here to ensure consistency across popup and content script
 */
export const featureDefinitions: readonly FeatureDefinition[] = [
	{
		name: "hideSubforemSwitcher",
		context: ["global"],
		type: "hide",
		settingKey: { section: "global", key: "hideSubforemSwitcher" },
		label: "Subforem Switcher",
	},
	{
		name: "hideLeftSidebar",
		context: ["home"],
		type: "hide",
		settingKey: { section: "home", key: "hideLeftSidebar" },
		label: "Left Sidebar",
	},
	{
		name: "hideRightSidebarHome",
		context: ["home"],
		type: "hide",
		settingKey: { section: "home", key: "hideRightSidebar" },
		label: "Right Sidebar",
	},
	{
		name: "hideRightSidebarArticle",
		context: ["article"],
		type: "hide",
		settingKey: { section: "article", key: "hideRightSidebar" },
		label: "Right Sidebar",
	},
	{
		name: "engagementButtonMover",
		context: ["article"],
		type: "hide",
		settingKey: { section: "article", key: "moveEngagement" },
		label: "Move Engagement Buttons",
	},
	{
		name: "readingStats",
		context: ["article"],
		type: "add",
		settingKey: { section: "article", key: "showReadingStats" },
		label: "Reading Stats",
	},
	{
		name: "tableOfContents",
		context: ["article"],
		type: "add",
		settingKey: { section: "article", key: "showToC" },
		label: "Sticky Table of Contents",
	},
	{
		name: "copyArticleButton",
		context: ["article"],
		type: "add",
		settingKey: { section: "article", key: "showCopyButton" },
		label: "Copy Article Button",
	},
	{
		name: "centerArticle",
		context: ["article"],
		type: "add",
		settingKey: { section: "article", key: "centerArticle" },
		label: "Center Article",
	},
	{
		name: "hideRightSidebarEditor",
		context: ["postEditor"],
		type: "hide",
		settingKey: { section: "postEditor", key: "hideRightSidebar" },
		label: "Hide Right Sidebar",
	},
	{
		name: "centerEditor",
		context: ["postEditor"],
		type: "add",
		settingKey: { section: "postEditor", key: "centerEditor" },
		label: "Center Editor",
	},
] as const;

/**
 * Helper to get a feature definition by name
 */
export function getFeatureDefinition(
	name: string,
): FeatureDefinition | undefined {
	return featureDefinitions.find((f) => f.name === name);
}
