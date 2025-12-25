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
  const isArticle = document.body.classList.contains('crayons-layout--article') || document.querySelector('.crayons-article__body');
  const isHome = document.querySelector('.stories-index') !== null;

  const body = document.body;

  if (isArticle) {
    toggleSidebarClass(body, settings.article.hideLeftSidebar, settings.article.hideRightSidebar);
  } else if (isHome) {
    toggleSidebarClass(body, settings.home.hideLeftSidebar, settings.home.hideRightSidebar);
  }
}