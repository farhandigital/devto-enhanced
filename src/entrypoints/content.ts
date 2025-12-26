import { applyLayoutCleaning } from '@/utils/features/layoutCleaner';
import { handleEngagementButtons } from '@/utils/features/articleActionMover';
import { renderReadingStats } from '@/utils/features/readingStats';
import { renderTableOfContents } from '@/utils/features/tocGenerator';
import { settingsStorage } from '@/utils/storage';
import type { ExtensionSettings } from '@/utils/types';
import './devto.css';

const state = {
  debounceTimer: null as ReturnType<typeof setTimeout> | null,
  observer: null as MutationObserver | null,
  initialized: false,
};

export default defineContentScript({
  matches: ['https://dev.to/*'],
  cssInjectionMode: 'manifest', 
  
  async main() {
    if (state.initialized) return;
    state.initialized = true;

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
    state.observer = new MutationObserver((mutations) => {
      // Filter out mutations from our injected elements to prevent infinite loops
      const relevantMutations = mutations.filter(mutation => {
        const target = mutation.target as Element;
        // Skip any mutations that are within our TOC or reading stats containers
        if (target.id === 'dt-toc' || target.closest('#dt-toc') || 
            target.id === 'dt-reading-stats' || target.closest('#dt-reading-stats')) {
          return false;
        }
        return true;
      });

      // If no relevant mutations, skip processing
      if (relevantMutations.length === 0) {
        return;
      }

      // Only apply layout cleaning for significant mutations (page transitions)
      // Skip mutations from lazy-loaded content, ads, or irrelevant elements
      const significantMutation = relevantMutations.some(mutation => {
        // Check for page structure changes (main content replacements)
        if (mutation.type === 'childList') {
          // Look for changes to article content or stories index (main page structure)
          const target = mutation.target as Element;
          const isMainContent = target.id === 'main-content' || 
                               target.classList.contains('stories-index') ||
                               target.classList.contains('crayons-article__body');
          if (isMainContent) return true;
        }
        
        // Check for body class changes (layout class toggles from other sources)
        if (mutation.type === 'attributes' && mutation.target === document.body) {
          return true;
        }
        
        return false;
      });
      
      if (significantMutation) {
        applyLayoutCleaning(settings);
        
        // Also apply engagement buttons immediately on article pages to avoid blinking
        if (document.querySelector('.crayons-article__body')) {
          handleEngagementButtons(settings);
          // Only re-render TOC/reading stats on significant page changes
          renderReadingStats(settings);
          renderTableOfContents(settings);
        }
      }
    });
    
    // Observe at document level but with filtered handling
    state.observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
      characterData: false
    });
  },
});

function runFeatures(settings: ExtensionSettings) {
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