/**
 * Hide Right Sidebar Feature (Article Page)
 * Hides the right sidebar on article pages
 */

import { registerFeature } from "@/features/core/registry";
import type { ExtensionSettings, FeatureDefinition } from "@/types";

const feature: FeatureDefinition = {
	name: "hideRightSidebarArticle",
	context: ["article"],
	type: "hide",
	settingKey: { section: "article", key: "hideRightSidebar" },
	label: "Right Sidebar",
	cssClass: "dt-clean-right",
	execute: (settings: ExtensionSettings) => {
		document.body.classList.toggle(
			"dt-clean-right",
			settings.article.hideRightSidebar,
		);
	},
};

registerFeature(feature);

export default feature;
