/**
 * Feature metadata registration
 * This file registers ONLY the metadata for features without importing their implementations.
 * Used by the popup to display UI toggles without loading feature code.
 *
 * NOTE: We deliberately duplicate the feature definitions here instead of importing
 * from feature-definitions.ts. Importing the shared definition file causes the
 * bundler to merge this file with the content script bundle (where definitions are
 * also used), defeating the lazy-loading performance optimization of the popup.
 */

import { registerFeature } from "./registry";

// Register hide subforem switcher (global)
registerFeature({
	name: "hideSubforemSwitcher",
	context: ["global"],
	type: "hide",
	settingKey: { section: "global", key: "hideSubforemSwitcher" },
	label: "Subforem Switcher",
	execute: () => {}, // No-op for metadata-only registration
});

// Register hide left sidebar (home)
registerFeature({
	name: "hideLeftSidebar",
	context: ["home"],
	type: "hide",
	settingKey: { section: "home", key: "hideLeftSidebar" },
	label: "Left Sidebar",
	execute: () => {},
});

// Register hide right sidebar (home)
registerFeature({
	name: "hideRightSidebarHome",
	context: ["home"],
	type: "hide",
	settingKey: { section: "home", key: "hideRightSidebar" },
	label: "Right Sidebar",
	execute: () => {},
});

// Register hide right sidebar (article)
registerFeature({
	name: "hideRightSidebarArticle",
	context: ["article"],
	type: "hide",
	settingKey: { section: "article", key: "hideRightSidebar" },
	label: "Right Sidebar",
	execute: () => {},
});

// Register engagement button mover (article-only feature)
registerFeature({
	name: "engagementButtonMover",
	context: ["article"],
	type: "hide",
	settingKey: { section: "article", key: "moveEngagement" },
	label: "Move Engagement Buttons",
	execute: () => {},
});

// Register reading stats (article-only feature)
registerFeature({
	name: "readingStats",
	context: ["article"],
	type: "add",
	settingKey: { section: "article", key: "showReadingStats" },
	label: "Reading Stats",
	execute: () => {},
});

// Register table of contents (article-only feature)
registerFeature({
	name: "tableOfContents",
	context: ["article"],
	type: "add",
	settingKey: { section: "article", key: "showToC" },
	label: "Sticky Table of Contents",
	execute: () => {},
});

// Register copy article button (article-only feature)
registerFeature({
	name: "copyArticleButton",
	context: ["article"],
	type: "add",
	settingKey: { section: "article", key: "showCopyButton" },
	label: "Copy Article Button",
	execute: () => {},
});

// Register article centering (article-only feature)
// Only activates when both sidebars hidden + ToC disabled
registerFeature({
	name: "centerArticle",
	context: ["article"],
	type: "add",
	settingKey: { section: "article", key: "centerArticle" },
	label: "Center Article",
	execute: () => {},
});

// Register hide right sidebar (post editor)
registerFeature({
	name: "hideRightSidebarEditor",
	context: ["postEditor"],
	type: "hide",
	settingKey: { section: "postEditor", key: "hideRightSidebar" },
	label: "Hide Right Sidebar",
	execute: () => {},
});

// Register editor centering (post editor-only feature)
// Only activates when right sidebar is hidden
registerFeature({
	name: "centerEditor",
	context: ["postEditor"],
	type: "add",
	settingKey: { section: "postEditor", key: "centerEditor" },
	label: "Center Editor",
	execute: () => {},
});
