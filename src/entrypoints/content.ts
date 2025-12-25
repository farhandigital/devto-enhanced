import { applyLayoutCleaning } from '@/utils/features/layoutCleaner';
import { handleEngagementButtons } from '@/utils/features/articleActionMover';
import { renderReadingStats } from '@/utils/features/readingStats';
import { renderTableOfContents } from '@/utils/features/tocGenerator';
import { settingsStorage } from '@/utils/storage';
import './devto.css';

export default defineContentScript({
  matches: ['https://dev.to/*'],
  cssInjectionMode: 'ui', 
  
  async main() {
    // 1. Initial Load
    const settings = await settingsStorage.getValue();
    runFeatures(settings);

    // 2. Watch for settings changes
    settingsStorage.watch((newSettings) => {
      if (newSettings) runFeatures(newSettings);
    });

    // 3. Handle Dev.to SPA navigation (InstantClick/Turbo)
    // Dev.to pages change without full reload. We observe the body for significant changes.
    const observer = new MutationObserver(() => {
      runFeatures(settings); 
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  },
});

function runFeatures(settings: any) {
  // Apply global layout cleaning (CSS classes)
  applyLayoutCleaning(settings);

  // Article specific features
  // We check if we are on an article page by looking for the article body class
  if (document.querySelector('.crayons-article__body')) {
    handleEngagementButtons(settings);
    renderReadingStats(settings);
    renderTableOfContents(settings);
  }
}