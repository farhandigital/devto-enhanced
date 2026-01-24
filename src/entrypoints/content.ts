/**
 * Content Script Entry Point
 *
 * Main entry point for the extension's content script.
 * Handles feature initialization and SPA navigation detection.
 */

import "@/features/definitions"; // Register all features
import { Selectors } from "@/config/selectors";
import { executeFeatures } from "@/features/core/registry";
import type { ExtensionSettings, PageContext } from "@/types";
import { PageDetector } from "@/utils/pageDetector";
import { settingsStorage } from "@/utils/storage";
import "./devto.css";

function getFeatureContext(): PageContext {
	const pageType = PageDetector.getPageType();
	return pageType === "article" || pageType === "home" ? pageType : "other";
}

const state = {
	observer: null as MutationObserver | null,
	initialized: false,
};

export default defineContentScript({
	matches: ["https://dev.to/*"],
	cssInjectionMode: "manifest",

	async main(_ctx) {
		if (state.initialized) return;
		state.initialized = true;

		// 1. Initial Load
		let settings = await settingsStorage.getValue();
		runFeatures(settings);

		// 2. Watch for settings changes
		settingsStorage.watch((newSettings) => {
			if (newSettings) {
				settings = newSettings;
				runFeatures(newSettings);
			}
		});

		// 3. Handle dev.to SPA navigation (InstantClick/Turbo)
		state.observer = new MutationObserver((mutations) => {
			// Filter out mutations from our injected elements to prevent infinite loops
			const relevantMutations = mutations.filter((mutation) => {
				const target = mutation.target as Element;
				// Skip any mutations that are within our TOC or reading stats containers
				if (
					target.id === "dt-toc" ||
					target.closest("#dt-toc") ||
					target.id === "dt-reading-stats" ||
					target.closest("#dt-reading-stats")
				) {
					return false;
				}
				return true;
			});

			// If no relevant mutations, skip processing
			if (relevantMutations.length === 0) {
				return;
			}

			// Only apply layout cleaning for significant mutations (page transitions)
			const significantMutation = relevantMutations.some((mutation) => {
				// Check for page structure changes (main content replacements)
				if (mutation.type === "childList") {
					const target = mutation.target as Element;
					const isMainContent =
						target.matches(Selectors.mainContent) ||
						target.matches(Selectors.pageContentInner) ||
						target.matches(Selectors.home.storiesIndex) ||
						target.matches(Selectors.article.body);

					if (isMainContent) return true;
				}

				// Check for body class changes, but IGNORE our own dt-* classes
				if (
					mutation.type === "attributes" &&
					mutation.target === document.body
				) {
					const oldValue = mutation.oldValue || "";
					const newValue = (mutation.target as HTMLElement).className;

					const oldClasses = new Set(oldValue.split(/\s+/).filter((c) => c));
					const newClasses = new Set(newValue.split(/\s+/).filter((c) => c));

					const added = [...newClasses].filter((c) => !oldClasses.has(c));
					const removed = [...oldClasses].filter((c) => !newClasses.has(c));
					const allChanges = [...added, ...removed];

					// If ALL changes are our own dt-* classes, ignore this mutation
					const onlyOurClasses = allChanges.every((cls) =>
						cls.startsWith("dt-"),
					);

					if (onlyOurClasses) {
						return false;
					}

					return true;
				}

				return false;
			});

			if (significantMutation) {
				executeFeatures(getFeatureContext(), settings);
			}
		});

		// Observe at document level but with filtered handling
		state.observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["class"],
			attributeOldValue: true,
			characterData: false,
		});
	},
});

function runFeatures(settings: ExtensionSettings) {
	executeFeatures(getFeatureContext(), settings);
}
