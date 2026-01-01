/**
 * Feature registration file for content script
 * Uses shared feature definitions and maps them to real execute functions.
 * This is the full feature bundle with actual implementations.
 */

import type { ExtensionSettings } from "@/types/settings";
import { handleEngagementButtons } from "./articleActionMover";
import { handleArticleCentering } from "./articleCentering";
import { renderCopyArticleButton } from "./copyArticle";
import { handleEditorCentering } from "./editorCentering";
import { getFeatureDefinition } from "./feature-definitions";
import { applyLayoutCleaning } from "./layoutCleaner";
import { renderReadingStats } from "./readingStats";
import { registerFeature } from "./registry";

import { renderTableOfContents } from "./tocGenerator";

/**
 * Map of feature names to their execute functions
 * This is the only place where feature name -> implementation mapping exists
 */
const executeMap: Record<string, (settings: ExtensionSettings) => void> = {
	hideSubforemSwitcher: applyLayoutCleaning,
	hideLeftSidebar: applyLayoutCleaning,
	hideRightSidebarHome: applyLayoutCleaning,
	hideRightSidebarArticle: applyLayoutCleaning,
	engagementButtonMover: handleEngagementButtons,
	readingStats: renderReadingStats,
	tableOfContents: renderTableOfContents,
	copyArticleButton: renderCopyArticleButton,
	centerArticle: handleArticleCentering,
	hideRightSidebarEditor: applyLayoutCleaning,
	centerEditor: handleEditorCentering,
};

// Register all features with their real execute functions
for (const [name, execute] of Object.entries(executeMap)) {
	const definition = getFeatureDefinition(name);
	if (!definition) {
		console.warn(`Feature definition not found for: ${name}`);
		continue;
	}
	registerFeature({
		...definition,
		execute,
	});
}
