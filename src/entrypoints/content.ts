import '@/features'; // Register all features
import { executeFeatures } from '@/features/registry';
import { PageDetector } from '@/utils/pageDetector';
import { Selectors } from '@/utils/selectors';
import { settingsStorage } from '@/utils/storage';
import type { ExtensionSettings } from '@/types';
import './devto.css';

/** Normalize PageDetector result to feature registry context */
function getFeatureContext(): 'article' | 'home' | 'other' {
  const pageType = PageDetector.getPageType();
  return pageType === 'article' || pageType === 'home' ? pageType : 'other';
}

const state = {
  debounceTimer: null as ReturnType<typeof setTimeout> | null,
  observer: null as MutationObserver | null,
  initialized: false,
};

function updateSmoothScrollState(): void {
  const isArticle = PageDetector.isArticle();
  
  if (isArticle) {
    // Enable smooth scroll on article pages (after ToC is ready)
    // The actual enabling happens in tocGenerator when ToC is rendered
  } else {
    // Disable smooth scroll on non-article pages
    document.documentElement.classList.remove('dt-smooth-scroll-enabled');
  }
}

export default defineContentScript({
  matches: ['https://dev.to/*'],
  cssInjectionMode: 'manifest', 
  
  async main(ctx) {
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

    // 3. Handle SPA navigation with wxt:locationchange event specifically for cleaning up smooth scroll state
    // We could've used URL watcher to replace the entire mutation observer, but unfortunately the event doesn't fire fast enough to prevent layout shifts on navigation.
    ctx.addEventListener(window, 'wxt:locationchange', () => {
      updateSmoothScrollState();
    });

    // 4. Handle Dev.to SPA navigation (InstantClick/Turbo)
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
          const isMainContent = target.matches(Selectors.mainContent) || 
                               target.matches(Selectors.home.storiesIndex) ||
                               target.matches(Selectors.article.body);
          if (isMainContent) return true;
        }
        
        // Check for body class changes, but IGNORE our own dt-* classes to prevent infinite loop
        if (mutation.type === 'attributes' && mutation.target === document.body) {
          const oldValue = mutation.oldValue || '';
          const newValue = (mutation.target as HTMLElement).className;
          
          // Check if the change is only our dt-* classes (dt-clean-left, dt-clean-right, dt-hide-subforem, dt-smooth-scroll-enabled)
          const oldClasses = new Set(oldValue.split(/\s+/).filter(c => c));
          const newClasses = new Set(newValue.split(/\s+/).filter(c => c));
          
          // Find what changed
          const added = [...newClasses].filter(c => !oldClasses.has(c));
          const removed = [...oldClasses].filter(c => !newClasses.has(c));
          const allChanges = [...added, ...removed];
          
          // If ALL changes are our own dt-* classes, ignore this mutation
          const onlyOurClasses = allChanges.every(cls => cls.startsWith('dt-'));
          if (onlyOurClasses) {
            return false; // Ignore our own class changes
          }
          
          return true; // External class change, this is significant
        }
        
        return false;
      });
      
      if (significantMutation) {
        executeFeatures(getFeatureContext(), settings);
      }
    });
    
    // Observe at document level but with filtered handling
    state.observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true, // Need this to compare old vs new classes
      characterData: false
    });
  },
});

function runFeatures(settings: ExtensionSettings) {
  executeFeatures(getFeatureContext(), settings);
}