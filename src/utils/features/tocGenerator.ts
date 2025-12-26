import type { ExtensionSettings } from '@/utils/types';

// Store the observer globally so we can disconnect it on re-render
let headingObserver: IntersectionObserver | null = null;

export function renderTableOfContents(settings: ExtensionSettings) {
  const existingToC = document.getElementById('dt-toc');
  const rightSidebar = document.querySelector('.crayons-layout__sidebar-right');
  const articleBody = document.querySelector('#article-body');

  // Clean up existing observer
  if (headingObserver) {
    headingObserver.disconnect();
    headingObserver = null;
  }

  // Remove if exists (re-render or disable)
  if (existingToC) existingToC.remove();

  if (!settings.article.showToC || !articleBody) {
    // Disable smooth scroll if not on an article page
    document.documentElement.classList.remove('dt-smooth-scroll-enabled');
    return;
  }

  // Find the article title from header#main-title
  const titleHeading = document.querySelector('header#main-title h1');
  
  // Find article body headings
  const articleHeadings = articleBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  // Combine title with article headings
  const allHeadings: Element[] = [];
  if (titleHeading) {
    allHeadings.push(titleHeading);
  }
  allHeadings.push(...Array.from(articleHeadings));
  
  if (allHeadings.length === 0) return;

  // If no sidebar exists, we can't inject the ToC
  if (!rightSidebar) return;

  // Create Container
  const tocContainer = document.createElement('div');
  tocContainer.id = 'dt-toc';
  tocContainer.className = 'dt-toc-container';

  const tocInner = document.createElement('div');
  tocInner.className = 'dt-toc-inner';

  const title = document.createElement('div');
  title.className = 'dt-toc-title';
  title.textContent = 'Table of Contents';
  tocInner.appendChild(title);

  const list = document.createElement('ul');
  list.className = 'dt-toc-list';

  allHeadings.forEach((heading, index) => {
    // Ensure heading has ID
    if (!heading.id) {
      heading.id = `dt-heading-${index}`;
    }

    const level = parseInt(heading.tagName.substring(1));
    const item = document.createElement('li');
    item.className = `dt-toc-item dt-toc-level-${level}`;

    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.className = 'dt-toc-link';
    link.textContent = heading.textContent;

    item.appendChild(link);
    list.appendChild(item);
  });

  tocInner.appendChild(list);
  tocContainer.appendChild(tocInner);

  // Inject ToC as the last item in the right sidebar
  rightSidebar.appendChild(tocContainer);
  
  // Enable smooth scrolling only on article pages after ToC is ready
  document.documentElement.classList.add('dt-smooth-scroll-enabled');

  // Setup intersection observer for active section highlighting
  setupActiveHeadingObserver(allHeadings, tocContainer);
}

function setupActiveHeadingObserver(
  headings: Element[],
  tocContainer: HTMLElement
) {
  // Track the state of each heading: above the zone, in the zone, or below it
  const headingStates = new Map<Element, 'above' | 'in-zone' | 'below'>();
  
  // Initialize all as below
  headings.forEach(h => headingStates.set(h, 'below'));
  
  const updateTocHighlight = (activeHeading: Element | null) => {
    const allLinks = tocContainer.querySelectorAll('.dt-toc-link');
    allLinks.forEach(link => link.classList.remove('dt-toc-active'));
    
    if (activeHeading) {
      const activeLink = tocContainer.querySelector(`a[href="#${activeHeading.id}"]`);
      if (activeLink) {
        activeLink.classList.add('dt-toc-active');
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };
  
  const determineActiveHeading = () => {
    let activeHeading: Element | null = null;
    
    // Find the last heading that's in the zone or has passed above it
    for (const heading of headings) {
      const state = headingStates.get(heading);
      if (state === 'in-zone' || state === 'above') {
        activeHeading = heading; // Keep updating to get the last one
      }
    }
    
    // Edge case: first heading is visible but hasn't reached threshold yet
    if (!activeHeading && headings.length > 0 && headingStates.get(headings[0]) === 'below') {
      const rect = headings[0].getBoundingClientRect();
      if (rect.top > 0 && rect.top < window.innerHeight) {
        activeHeading = headings[0];
      }
    }
    
    updateTocHighlight(activeHeading);
  };
  
  headingObserver = new IntersectionObserver(
    (entries) => {
      // Only process the headings that actually changed
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          headingStates.set(entry.target, 'in-zone');
        } else {
          // Use the intersection data to determine if above or below
          // entry.boundingClientRect and entry.rootBounds are already computed
          if (entry.rootBounds && entry.boundingClientRect.bottom < entry.rootBounds.top) {
            headingStates.set(entry.target, 'above');
          } else {
            headingStates.set(entry.target, 'below');
          }
        }
      });
      
      determineActiveHeading();
    },
    {
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0,
    }
  );
  
  headings.forEach(heading => headingObserver!.observe(heading));
  
  // Trigger initial highlight after next paint to ensure layout is calculated
  requestAnimationFrame(() => determineActiveHeading());
}