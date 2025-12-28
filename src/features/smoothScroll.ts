/**
 * Smooth Scroll Feature
 * Enables smooth scrolling for better UX when navigating with ToC links
 * Only active on article pages
 */

import type { ExtensionSettings } from '@/types/settings';

export function enableSmoothScroll(settings: ExtensionSettings) {
  // Smooth scroll is independently configurable
  if (settings.article.enableSmoothScroll) {
    document.documentElement.classList.add('dt-smooth-scroll-enabled');
  } else {
    document.documentElement.classList.remove('dt-smooth-scroll-enabled');
  }
}
