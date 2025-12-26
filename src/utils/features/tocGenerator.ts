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

  // Find headings
  const headings = articleBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) return;

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

  headings.forEach((heading, index) => {
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
  setupActiveHeadingObserver(headings, tocContainer);
}

function setupActiveHeadingObserver(
  headings: NodeListOf<Element>,
  tocContainer: HTMLElement
) {
  const updateActiveHeading = () => {
    let activeHeading: Element | null = null;
    const threshold = window.innerHeight * 0.2; // 20% from top

    // Check all headings to find which one should be active
    for (const heading of Array.from(headings)) {
      const rect = heading.getBoundingClientRect();
      
      // A heading is a candidate if:
      // 1. It's at or past the threshold (already scrolled up), OR
      // 2. It's approaching/at the threshold from below (about to cross)
      // We want the last heading that satisfies this condition
      if (rect.top <= threshold) {
        activeHeading = heading;
      }
    }
    
    // If no heading has crossed the threshold yet, check if we're at the very top
    // In that case, make the first heading active if we're near the start of the article
    if (!activeHeading && headings.length > 0) {
      const firstHeadingRect = headings[0].getBoundingClientRect();
      if (firstHeadingRect.top > 0 && firstHeadingRect.top < window.innerHeight) {
        activeHeading = headings[0];
      }
    }

    // Update ToC highlighting
    const allLinks = tocContainer.querySelectorAll('.dt-toc-link');
    allLinks.forEach((link) => {
      link.classList.remove('dt-toc-active');
    });

    if (activeHeading) {
      const activeLink = tocContainer.querySelector(
        `a[href="#${activeHeading.id}"]`
      );
      if (activeLink) {
        activeLink.classList.add('dt-toc-active');
      }
    }
  };

  // Create observer with root margin to trigger in the top 20% zone
  headingObserver = new IntersectionObserver(
    (entries) => {
      // Trigger update whenever any heading crosses into/out of the zone
      updateActiveHeading();
    },
    {
      // Trigger when headings cross into the top 20% zone
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0,
    }
  );

  // Observe all headings
  headings.forEach((heading) => {
    headingObserver!.observe(heading);
  });
  
  // Trigger initial highlight
  setTimeout(updateActiveHeading, 100);
}