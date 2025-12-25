import type { ExtensionSettings } from '@/utils/types';

/**
 * Helper to toggle sidebar CSS classes on the body element
 */
function toggleSidebarClass(body: HTMLElement, hideLeft: boolean, hideRight: boolean) {
  body.classList.toggle('dt-clean-left', hideLeft);
  body.classList.toggle('dt-clean-right', hideRight);
}

/**
 * Toggles CSS classes on the body to hide/show sidebars
 */
export function applyLayoutCleaning(settings: ExtensionSettings) {
  const isArticle = document.body.classList.contains('crayons-layout--article') || document.querySelector('.crayons-article__body') !== null;
  const isHome = document.querySelector('.stories-index') !== null;

  if (isArticle) {
    toggleSidebarClass(document.body, settings.article.hideLeftSidebar, settings.article.hideRightSidebar);
  } else if (isHome) {
    toggleSidebarClass(document.body, settings.home.hideLeftSidebar, settings.home.hideRightSidebar);
  } else {
    // Remove classes on pages where layout cleaning doesn't apply (e.g., user profiles, tags, search)
    toggleSidebarClass(document.body, false, false);
  }
}