/**
 * Table of Contents Feature
 * Generates a sticky ToC for article pages
 */

import type { ExtensionSettings } from '@/types/settings';
import { Selectors } from '@/config/selectors';

// Store the observer globally so we can disconnect it on re-render
let headingObserver: IntersectionObserver | null = null;

/**
 * Render a sticky table of contents in the right sidebar for an article page.
 *
 * Constructs a ToC from the article title and body headings, injects it into the right sidebar,
 * enables smooth scrolling on the document, and initializes active-section highlighting using
 * an IntersectionObserver. Existing ToC or observer state is cleaned up before rendering.
 *
 * @param settings - Extension settings; `settings.article.showToC` controls whether the ToC is rendered
 */
export function renderTableOfContents(settings: ExtensionSettings) {
  const existingToC = document.getElementById('dt-toc');
  const rightSidebar = document.querySelector(Selectors.layout.rightSidebar);
  const articleBody = document.querySelector(Selectors.article.bodyId);

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
  const titleHeading = document.querySelector(Selectors.article.titleHeader);

  // Find article body headings
  const articleHeadings = articleBody.querySelectorAll(
    Selectors.article.headings
  );

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

/**
 * Initialize observation of article headings and keep the table of contents in sync with the currently visible section.
 *
 * Sets up a global IntersectionObserver that updates which ToC link is highlighted (adds `dt-toc-active`) based on heading positions, scrolls the active link into view, and schedules an initial highlight pass.
 *
 * @param headings - The list of article heading elements to observe for active-section changes
 * @param tocContainer - The ToC container element that contains the `.dt-toc-link` anchors to update
 */
function setupActiveHeadingObserver(
  headings: Element[],
  tocContainer: HTMLElement
) {
  const updateActiveHeading = () => {
    let activeHeading: Element | null = null;
    const threshold = window.innerHeight * 0.2; // 20% from top

    // Check all headings to find which one should be active
    // This is the reliable approach that checks actual positions
    for (const heading of headings) {
      const rect = heading.getBoundingClientRect();

      // A heading is a candidate if it's at or past the threshold
      // We want the last heading that satisfies this condition
      if (rect.top <= threshold) {
        activeHeading = heading;
      }
    }

    // Edge case: first heading is visible but hasn't reached threshold yet
    if (!activeHeading && headings.length > 0) {
      const firstHeadingRect = headings[0].getBoundingClientRect();
      if (
        firstHeadingRect.top > 0 &&
        firstHeadingRect.top < window.innerHeight
      ) {
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

        // Auto-scroll the ToC to keep the active link visible
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Key optimization: Use IntersectionObserver to trigger updates only when
  // headings cross boundaries, rather than on every scroll event.
  // This provides significant performance benefit while maintaining reliability.
  headingObserver = new IntersectionObserver(
    (entries) => {
      // Only update when headings actually cross into/out of the detection zone
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

  // Trigger initial highlight after next paint to ensure layout is calculated
  requestAnimationFrame(() => updateActiveHeading());
}