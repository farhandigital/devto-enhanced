/**
 * Smooth Scroll Feature
 * Enables smooth scrolling for better UX when navigating with ToC links
 * Only active on article pages
 */

import type { ExtensionSettings } from "@/types/settings";
import { PageDetector } from "@/utils/pageDetector";

export function enableSmoothScroll(settings: ExtensionSettings) {
	// Only apply smooth scroll on article pages
	const isArticle = PageDetector.isArticle();

	if (isArticle && settings.article.enableSmoothScroll) {
		document.documentElement.classList.add("dt-smooth-scroll-enabled");
	} else {
		document.documentElement.classList.remove("dt-smooth-scroll-enabled");
	}
}
