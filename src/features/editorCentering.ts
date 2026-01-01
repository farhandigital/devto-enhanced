/**
 * Post Editor Centering Feature
 * Centers post editor content when right sidebar is hidden
 */

import type { ExtensionSettings } from "@/types/settings";
import { PageDetector } from "@/utils/pageDetector";

/**
 * Centers the post editor content when right sidebar is hidden
 * Only activates when user explicitly enables the setting
 * Similar to article centering but for the post editor pages
 */
export function handleEditorCentering(settings: ExtensionSettings) {
	if (!PageDetector.isPostEditor()) return;

	// Only center if:
	// 1. User explicitly enabled centering
	// 2. Right sidebar is hidden
	const shouldCenter =
		settings.postEditor.centerEditor && settings.postEditor.hideRightSidebar;

	document.body.classList.toggle("dt-center-editor", shouldCenter);
}
