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
  // Create observer that checks position relative to top of viewport
  headingObserver = new IntersectionObserver(
    (entries) => {
      // Find the active heading: the last one that is above or at the trigger point
      let activeHeading: Element | null = null;

      // Check all headings to find which one should be active
      for (const heading of Array.from(headings)) {
        const rect = heading.getBoundingClientRect();
        // If heading is above the 20% mark (already scrolled past), it's a candidate
        // We want the last (bottommost) heading that's above this threshold
        if (rect.top <= window.innerHeight * 0.2) {
          activeHeading = heading;
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
    },
    {
      // Trigger observer whenever any heading crosses any boundary
      threshold: [0, 0.5, 1],
    }
  );

  // Observe all headings
  headings.forEach((heading) => {
    headingObserver!.observe(heading);
  });
  
  // Also trigger an immediate update on initial render
  headingObserver.takeRecords();
  
  // Manually trigger initial highlight check
  setTimeout(() => {
    let activeHeading: Element | null = null;
    for (const heading of Array.from(headings)) {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.2) {
        activeHeading = heading;
      }
    }
    
    if (activeHeading) {
      const activeLink = tocContainer.querySelector(
        `a[href="#${activeHeading.id}"]`
      );
      if (activeLink) {
        activeLink.classList.add('dt-toc-active');
      }
    }
  }, 100);
}