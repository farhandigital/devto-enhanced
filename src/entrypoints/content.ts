import { applyLayoutCleaning } from '@/utils/features/layoutCleaner';
import { handleEngagementButtons } from '@/utils/features/articleActionMover';
import { renderReadingStats } from '@/utils/features/readingStats';
import { renderTableOfContents } from '@/utils/features/tocGenerator';
import { settingsStorage } from '@/utils/storage';
import type { ExtensionSettings } from '@/utils/types';
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
      
      // Filter out mutations caused by our own extension elements
      const hasSignificantChanges = mutations.some(mutation => {
        if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
          return false;
        }
        
        // Ignore mutations within our extension's elements (prefixed with dt-)
        const target = mutation.target as Element;
        if (target.id?.startsWith('dt-') || target.className?.includes('dt-')) {
          return false;
        }
        
        // Ignore mutations that only add our extension elements
        const addedExtensionElements = Array.from(mutation.addedNodes).every(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return false;
          const element = node as Element;
          return element.id?.startsWith('dt-') || element.className?.includes('dt-');
        });
        
        return !addedExtensionElements;
      });
      
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