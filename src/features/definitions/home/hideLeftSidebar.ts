/**
 * Hide Left Sidebar Feature (Home Page)
 * Hides the left navigation sidebar on the home/feed page
 */

import { registerFeature } from "@/features/core/registry";
import type { ExtensionSettings, FeatureDefinition } from "@/types";

const feature: FeatureDefinition = {
	name: "hideLeftSidebar",
	context: ["home"],
	type: "hide",
	settingKey: { section: "home", key: "hideLeftSidebar" },
	label: "Left Sidebar",
	cssClass: "dt-clean-left",
	execute: (settings: ExtensionSettings) => {
		document.body.classList.toggle(
			"dt-clean-left",
			settings.home.hideLeftSidebar,
		);
	},
};

registerFeature(feature);

export default feature;
