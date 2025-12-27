import type { ExtensionSettings } from '@/utils/types';
import { PageDetector } from '@/utils/pageDetector';

/**
 * Centers the article content when right sidebar is completely empty
 * Only activates when user explicitly enables the setting
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
