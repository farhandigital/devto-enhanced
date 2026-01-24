/**
 * Hide Right Sidebar Feature (Home Page)
 * Hides the right sidebar on the home/feed page
 */

import { registerFeature } from "@/features/core/registry";
import type { ExtensionSettings, FeatureDefinition } from "@/types";

const feature: FeatureDefinition = {
	name: "hideRightSidebarHome",
	context: ["home"],
	type: "hide",
	settingKey: { section: "home", key: "hideRightSidebar" },
	label: "Right Sidebar",
	cssClass: "dt-clean-right",
	execute: (settings: ExtensionSettings) => {
		document.body.classList.toggle(
			"dt-clean-right",
			settings.home.hideRightSidebar,
		);
	},
};

registerFeature(feature);

export default feature;
