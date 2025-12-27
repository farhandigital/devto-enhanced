/**
 * Article Centering Feature
 * Centers article content when sidebars are hidden
 */

import type { ExtensionSettings } from '@/types/settings';
import { PageDetector } from '@/utils/pageDetector';

/**
 * Centers article content by toggling the 'dt-center-article' class on document.body when the right sidebar is hidden and the table of contents is disabled.
 *
 * @param settings - Extension settings used to determine whether article centering should be applied
 */
export function handleArticleCentering(settings: ExtensionSettings) {
  if (!PageDetector.isArticle()) return;

  // Only center if:
  // 1. User explicitly enabled centering
  // 2. Right sidebar is hidden (original content gone)
  // 3. ToC is disabled (nothing injecting into right sidebar space)
  const shouldCenter =
    settings.article.centerArticle &&
    settings.article.hideRightSidebar &&
    !settings.article.showToC;

  document.body.classList.toggle('dt-center-article', shouldCenter);
}