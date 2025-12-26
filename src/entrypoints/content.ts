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
    state.observer = new MutationObserver(() => {
      // Clear existing timer to debounce rapid mutations
      if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
      }
      
      state.debounceTimer = setTimeout(() => {
        runFeatures(settings);
        state.debounceTimer = null;
      }, 100); // 100ms debounce delay
    });
    
    // Observe the main content container or body if not found
    const targetNode = document.querySelector('#main-content') || document.body;
    state.observer.observe(targetNode, { 
      childList: true, 
      subtree: true,
      attributes: false,
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