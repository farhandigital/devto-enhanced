/**
 * Smooth Scroll Feature
 * Enables smooth scrolling for better UX when navigating with ToC links
 * Only active on article pages
 */

import type { ExtensionSettings } from '@/types/settings';

export function enableSmoothScroll(settings: ExtensionSettings) {
  // Only enable smooth scroll on article pages
  // The setting is linked to ToC being enabled, since smooth scroll is primarily for ToC navigation
  if (settings.article.showToC) {
    document.documentElement.classList.add('dt-smooth-scroll-enabled');
  } else {
    document.documentElement.classList.remove('dt-smooth-scroll-enabled');
  }
}
