/**
 * Hide Subforem Switcher Feature
 * Hides the subforem navigation sidebar globally
 */

import { registerFeature } from "@/features/core/registry";
import type { ExtensionSettings, FeatureDefinition } from "@/types";

const feature: FeatureDefinition = {
	name: "hideSubforemSwitcher",
	context: ["global"],
	type: "hide",
	settingKey: { section: "global", key: "hideSubforemSwitcher" },
	label: "Subforem Switcher",
	cssClass: "dt-hide-subforem",
	execute: (settings: ExtensionSettings) => {
		document.body.classList.toggle(
			"dt-hide-subforem",
			settings.global.hideSubforemSwitcher,
		);
	},
};

registerFeature(feature);

export default feature;
