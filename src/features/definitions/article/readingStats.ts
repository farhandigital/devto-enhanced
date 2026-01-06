/**
 * Reading Stats Feature
 * Displays word count and estimated reading time on articles
 */

import { Selectors } from "@/config/selectors";
import { registerFeature } from "@/features/core/registry";
import type { ExtensionSettings, FeatureDefinition } from "@/types";

const CONTAINER_ID = "dt-reading-stats";

/**
 * Calculate reading stats for article content
 */
function calculateReadingStats(articleBody: Element): {
	words: number;
	minutes: number;
} {
	const text = articleBody.textContent || "";
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.ceil(words / 200));
	return { words, minutes };
}

/**
 * Create the reading stats UI element
 */
function createStatsElement(words: number, minutes: number): HTMLElement {
	const container = document.createElement("div");
	container.id = CONTAINER_ID;
	container.className = "dt-reading-stats";
	container.innerHTML = `
		<span class="dt-stat-badge">📖 ${minutes} min read</span>
		<span class="dt-stat-badge">📝 ${words.toLocaleString()} words</span>
	`;
	return container;
}

const feature: FeatureDefinition = {
	name: "readingStats",
	context: ["article"],
	type: "add",
	settingKey: { section: "article", key: "showReadingStats" },
	label: "Reading Stats",

	execute: (settings: ExtensionSettings) => {
		const existing = document.getElementById(CONTAINER_ID);

		if (!settings.article.showReadingStats) {
			existing?.remove();
			return;
		}

		// Already rendered
		if (existing) return;

		const articleBody = document.querySelector(Selectors.article.body);
		const titleHeader = document.querySelector(
			Selectors.article.titleHeaderContainer,
		);

		if (!articleBody || !titleHeader) return;

		const { words, minutes } = calculateReadingStats(articleBody);
		const statsElement = createStatsElement(words, minutes);
		titleHeader.insertAdjacentElement("afterend", statsElement);
	},

	cleanup: () => {
		document.getElementById(CONTAINER_ID)?.remove();
	},
};

registerFeature(feature);

export default feature;
