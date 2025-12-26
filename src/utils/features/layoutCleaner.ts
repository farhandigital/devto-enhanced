import type { ExtensionSettings } from '@/utils/types';
import { PageDetector } from '@/utils/pageDetector';
import { HIDEABLE_ELEMENTS, getSettingValue } from '@/config/hideableElements';

/**
 * Toggles CSS classes on the body to hide/show elements based on settings
 * Uses declarative configuration from HIDEABLE_ELEMENTS
 */
export function applyLayoutCleaning(settings: ExtensionSettings) {
  const pageType = PageDetector.getPageType();
  
  console.log('[DevTo Enhanced] layoutCleaner running:', {
    pageType,
    isArticle: PageDetector.isArticle(),
    hasArticleBody: !!document.querySelector('.crayons-article__body'),
    bodyClasses: document.body.classList.contains('crayons-layout--article'),
  });

  // Iterate through all hideable elements and apply classes based on context
  HIDEABLE_ELEMENTS.forEach((element) => {
    const shouldApply =
      element.context === 'global' || element.context === pageType;

    if (shouldApply) {
      const isEnabled = getSettingValue(settings, element.settingPath);
      console.log('[DevTo Enhanced] Applying:', {
        element: element.cssClass,
        context: element.context,
        settingPath: element.settingPath,
        isEnabled,
      });
      document.body.classList.toggle(element.cssClass, isEnabled);
    } else {
      // Remove class if not in the correct context
      console.log('[DevTo Enhanced] Removing (wrong context):', element.cssClass);
      document.body.classList.remove(element.cssClass);
    }
  });
}