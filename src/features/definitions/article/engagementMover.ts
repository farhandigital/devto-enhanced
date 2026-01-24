/**
 * Engagement Button Mover Feature
 * Moves engagement buttons (like, unicorn, etc.) to the article header area
 */

import { Selectors } from "@/config/selectors";
import { registerFeature } from "@/features/core/registry";
import type { ExtensionSettings, FeatureDefinition } from "@/types";
import { PageDetector } from "@/utils/pageDetector";

/**
 * Helper function to generate a unique selector for an element
 */
function getUniqueSelector(element: Element): string {
	if (element.id) {
		return `#${element.id}`;
	}

	if (element.className && typeof element.className === "string") {
		const classes = element.className.trim().split(/\s+/);
		const escapedClasses = classes.map((c) => CSS.escape(c)).join(".");
		if (escapedClasses) {
			try {
				if (document.querySelectorAll(`.${escapedClasses}`).length === 1) {
					return `.${escapedClasses}`;
				}
			} catch {
				// Invalid selector, fall through to nth-child
			}
		}
	}

	const parent = element.parentElement;
	if (parent) {
		const siblings = Array.from(parent.children);
		const index = siblings.indexOf(element);
		const tagName = element.tagName.toLowerCase();
		return `${getUniqueSelector(parent)} > ${tagName}:nth-child(${index + 1})`;
	}

	return element.tagName.toLowerCase();
}

function handleEngagementButtons(settings: ExtensionSettings) {
	if (!PageDetector.isArticle()) return;

	const actionsContainer = document.querySelector<HTMLElement>(
		Selectors.article.actions,
	);

	if (!actionsContainer) return;

	const isMoved = actionsContainer.classList.contains("dt-engagement-moved");

	if (settings.article.moveEngagement) {
		// Only move if not already moved
		if (!isMoved) {
			// Store the original parent and next sibling for restoration
			const originalParent = actionsContainer.parentElement;
			const originalNextSibling = actionsContainer.nextElementSibling;

			if (originalParent) {
				actionsContainer.dataset.originalParentSelector =
					getUniqueSelector(originalParent);
				if (originalNextSibling) {
					actionsContainer.dataset.originalNextSiblingSelector =
						getUniqueSelector(originalNextSibling);
				}
			}

			actionsContainer.classList.add("dt-engagement-moved");

			// Find the H1 and insert after it
			const h1 = document.querySelector(Selectors.article.titleHeader);
			if (h1?.parentElement) {
				h1.parentElement.insertBefore(actionsContainer, h1.nextElementSibling);
			}
		}
	} else {
		// Restore to original position if it was moved
		if (isMoved) {
			const originalParentSelector =
				actionsContainer.dataset.originalParentSelector;
			const originalNextSiblingSelector =
				actionsContainer.dataset.originalNextSiblingSelector;

			if (originalParentSelector) {
				const originalParent = document.querySelector(originalParentSelector);

				if (originalParent) {
					if (originalNextSiblingSelector) {
						const originalNextSibling = document.querySelector(
							originalNextSiblingSelector,
						);
						originalParent.insertBefore(actionsContainer, originalNextSibling);
					} else {
						originalParent.appendChild(actionsContainer);
					}
				}
			}

			actionsContainer.classList.remove("dt-engagement-moved");
			delete actionsContainer.dataset.originalParentSelector;
			delete actionsContainer.dataset.originalNextSiblingSelector;
		}
	}
}

const feature: FeatureDefinition = {
	name: "engagementButtonMover",
	context: ["article"],
	type: "hide",
	settingKey: { section: "article", key: "moveEngagement" },
	label: "Move Engagement Buttons",
	execute: handleEngagementButtons,
};

registerFeature(feature);

export default feature;
