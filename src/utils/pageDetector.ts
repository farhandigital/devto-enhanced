/**
 * Centralized page type detection for dev.to
 * Single source of truth for determining what page context we're in
 */

export const PageDetector = {
	/**
	 * Check if current page is an article page
	 */
	isArticle(): boolean {
		return (
			document.body.classList.contains("crayons-layout--article") ||
			document.querySelector(".crayons-article__body") !== null
		);
	},

	/**
	 * Check if current page is the home/feed page
	 */
	isHome(): boolean {
		return document.querySelector(".stories-index") !== null;
	},

	/**
	 * Check if current page is a user profile
	 */
	isProfile(): boolean {
		return document.querySelector("[data-user-id]") !== null;
	},

	/**
	 * Check if current page is a tag page
	 */
	isTag(): boolean {
		return document.querySelector("[data-tag]") !== null;
	},

	/**
	 * Check if current page is the post editor (new or edit)
	 */
	isPostEditor(): boolean {
		const pageContent = document.querySelector("#page-content");
		return (
			(pageContent?.classList.contains("articles-new") ||
				pageContent?.classList.contains("articles-edit")) ??
			false
		);
	},

	/**
	 * Get the current page type
	 */
	getPageType():
		| "article"
		| "home"
		| "profile"
		| "tag"
		| "postEditor"
		| "other" {
		if (this.isArticle()) return "article";
		if (this.isHome()) return "home";
		if (this.isPostEditor()) return "postEditor";
		if (this.isProfile()) return "profile";
		if (this.isTag()) return "tag";
		return "other";
	},
} as const;
