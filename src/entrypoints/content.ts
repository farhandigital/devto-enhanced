import { applyLayoutCleaning } from '@/utils/features/layoutCleaner';
import { handleEngagementButtons } from '@/utils/features/articleActionMover';
import { renderReadingStats } from '@/utils/features/readingStats';
import { renderTableOfContents } from '@/utils/features/tocGenerator';
import { settingsStorage } from '@/utils/storage';
import './devto.css';

export default defineContentScript({
  matches: ['https://dev.to/*'],
  cssInjectionMode: 'manifest', 
  
  async main() {
    // 1. Initial Load
    let settings = await settingsStorage.getValue();
    runFeatures(settings);

    // 2. Watch for settings changes
    settingsStorage.watch((newSettings) => {
      if (newSettings) {
        settings = newSettings;
        runFeatures(newSettings);
      }
    });

    // 3. Handle Dev.to SPA navigation (InstantClick/Turbo)
    // Dev.to pages change without full reload. We observe for significant changes.
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    
    const observer = new MutationObserver((mutations) => {
      // Clear existing timer to debounce rapid mutations
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // Only process if there are significant changes (childList mutations)
      const hasSignificantChanges = mutations.some(
        mutation => mutation.type === 'childList' && mutation.addedNodes.length > 0
      );
      
      if (hasSignificantChanges) {
        debounceTimer = setTimeout(() => {
          runFeatures(settings);
          debounceTimer = null;
        }, 150); // 150ms debounce delay
      }
    });
    
    // Observe the main content container or body if not found
    const targetNode = document.querySelector('#main-content') || document.body;
    observer.observe(targetNode, { 
      childList: true, 
      subtree: true,
      // Only watch for added/removed nodes, not attributes or character data
      attributes: false,
      characterData: false
    });
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