/**
 * Centralized Dev.to DOM selectors
 * Single source of truth for all CSS selectors used in the extension
 */

export const Selectors = {
	// Page structure
	body: "body",
	mainContent: "#main-content",

	// Article elements
	article: {
		body: ".crayons-article__body",
		bodyId: "#article-body",
		titleHeader: "header#main-title h1",
		titleHeaderContainer: "header#main-title",
		authorLink: "header#main-title .crayons-link.fw-bold",
		tagsContainer: ".spec__tags",
		headings: "h1, h2, h3, h4, h5, h6",
		actions: ".crayons-article-actions",
	},

	// Layout
	layout: {
		articleClass: "crayons-layout--article",
		leftSidebar: "#sidebar-wrapper-left",
		rightSidebar: ".crayons-layout__sidebar-right",
	},

	// Home/Feed
	home: {
		storiesIndex: ".stories-index",
	},

	// Global elements
	global: {
		subforemSwitcher: "#main-side-bar",
	},

	// User & profile
	user: {
		userId: "[data-user-id]",
	},

	// Tags
	tag: {
		tagData: "[data-tag]",
	},
} as const;
