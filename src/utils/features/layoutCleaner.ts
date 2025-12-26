import type { ExtensionSettings } from '@/utils/types';

/**
 * Helper to toggle sidebar CSS classes on the body element
 */
function toggleSidebarClass(body: HTMLElement, hideLeft: boolean, hideRight: boolean) {
  body.classList.toggle('dt-clean-left', hideLeft);
  body.classList.toggle('dt-clean-right', hideRight);
}

/**
 * Toggles CSS classes on the body to hide/show sidebars and other elements
 */
export function applyLayoutCleaning(settings: ExtensionSettings) {
  const isArticle = document.body.classList.contains('crayons-layout--article') || document.querySelector('.crayons-article__body') !== null;
  const isHome = document.querySelector('.stories-index') !== null;

  console.log('[dt-enhanced] Layout cleaning:', { isArticle, isHome, hideLeftSidebar: settings.home.hideLeftSidebar, hideRightSidebar: settings.home.hideRightSidebar });

  // Apply global settings (all pages)
  document.body.classList.toggle('dt-hide-subforem', settings.global.hideSubforemSwitcher);

  if (isArticle) {
    toggleSidebarClass(document.body, false, settings.article.hideRightSidebar);
  } else if (isHome) {
    toggleSidebarClass(document.body, settings.home.hideLeftSidebar, settings.home.hideRightSidebar);
  } else {
    // Remove classes on pages where layout cleaning doesn't apply (e.g., user profiles, tags, search)
    toggleSidebarClass(document.body, false, false);
  }

  console.log('[dt-enhanced] Classes after cleanup:', document.body.className);
}