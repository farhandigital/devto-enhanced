import type { ExtensionSettings } from '@/utils/types';

/**
 * Toggles CSS classes on the body to hide/show sidebars
 */
export function applyLayoutCleaning(settings: ExtensionSettings) {
  const isArticle = document.body.classList.contains('crayons-layout--article') || document.querySelector('.crayons-article__body');
  const isHome = document.querySelector('.stories-index') !== null;

  const body = document.body;

  if (isArticle) {
    // Left Sidebar
    if (settings.article.hideLeftSidebar) {
      body.classList.add('dt-clean-left');
    } else {
      body.classList.remove('dt-clean-left');
    }

    // Right Sidebar
    if (settings.article.hideRightSidebar) {
      body.classList.add('dt-clean-right');
    } else {
      body.classList.remove('dt-clean-right');
    }
  } else if (isHome) {
    // Left Sidebar Home
    if (settings.home.hideLeftSidebar) {
      body.classList.add('dt-clean-left');
    } else {
      body.classList.remove('dt-clean-left');
    }

    // Right Sidebar Home
    if (settings.home.hideRightSidebar) {
      body.classList.add('dt-clean-right');
    } else {
      body.classList.remove('dt-clean-right');
    }
  }
}