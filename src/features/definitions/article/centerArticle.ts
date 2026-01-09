/**
 * Center Article Feature
 * Centers the article content when sidebars are hidden and ToC is disabled
 */

import { registerFeature } from "@/features/core/registry";
import type { ExtensionSettings, FeatureDefinition } from "@/types";

const feature: FeatureDefinition = {
	name: "centerArticle",
	context: ["article"],
	type: "add",
	settingKey: { section: "article", key: "centerArticle" },
	label: "Center Article",
	cssClass: "dt-center-article",

	execute: (settings: ExtensionSettings) => {
		// Only center if:
		// 1. User explicitly enabled centering
		// 2. Right sidebar is hidden (original content gone)
		// 3. ToC is disabled (nothing injecting into right sidebar space)
		const shouldCenter =
			settings.article.centerArticle &&
			settings.article.hideRightSidebar &&
			!settings.article.showToC;

		document.body.classList.toggle("dt-center-article", shouldCenter);
	},

	isEnabled: (settings: ExtensionSettings) => {
		return settings.article.hideRightSidebar && !settings.article.showToC;
	},

	disabledTooltip: (settings: ExtensionSettings) => {
		if (!settings.article.hideRightSidebar && settings.article.showToC) {
			return "Requires: Right Sidebar hidden AND ToC disabled";
		}
		if (!settings.article.hideRightSidebar) {
			return "Requires: Right Sidebar hidden";
		}
		if (settings.article.showToC) {
			return "Requires: ToC disabled";
		}
		return null;
	},
};

registerFeature(feature);

export default feature;
