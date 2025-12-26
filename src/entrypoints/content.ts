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
      // Only apply layout cleaning for significant mutations (page transitions)
      // Skip mutations from lazy-loaded content, ads, or irrelevant elements
      const significantMutation = mutations.some(mutation => {
        // Check for page structure changes (main content replacements)
        if (mutation.type === 'childList') {
          // Look for changes to article content or stories index (main page structure)
          const target = mutation.target as Element;
          const isMainContent = target.id === 'main-content' || 
                               target.className?.includes('stories-index') ||
                               target.className?.includes('crayons-article__body');
          if (isMainContent) return true;
        }
        
        // Check for body class changes (layout class toggles from other sources)
        if (mutation.type === 'attributes' && mutation.target === document.body) {
          return true;
        }
        
        return false;
      });
      
      if (significantMutation) {
        console.log('[dt-enhanced] Significant mutation detected');
        applyLayoutCleaning(settings);
      }
      
      // Debounce other features regardless
      if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
      }
      
      state.debounceTimer = setTimeout(() => {
        console.log('[dt-enhanced] Debounce timeout - running other features');
        // Article specific features
        if (document.querySelector('.crayons-article__body')) {
          handleEngagementButtons(settings);
          renderReadingStats(settings);
          renderTableOfContents(settings);
        }
        state.debounceTimer = null;
      }, 150);
    });
    
    // Observe at document level but with filtered handling
    state.observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
      characterData: false
    });
    console.log('[dt-enhanced] Mutation observer set up on document root');
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