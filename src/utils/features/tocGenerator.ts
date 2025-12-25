import type { ExtensionSettings } from '@/utils/types';

export function renderTableOfContents(settings: ExtensionSettings) {
  const existingToC = document.getElementById('dt-toc');
  const rightSidebar = document.querySelector('#sidebar-wrapper-right') || document.querySelector('.crayons-layout__sidebar-right');
  const articleBody = document.querySelector('#article-body');

  // Remove if exists (re-render or disable)
  if (existingToC) existingToC.remove();

  if (!settings.article.showToC || !articleBody) return;

  // Find headings
  const headings = articleBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) return;

  // Create Container
  const tocContainer = document.createElement('div');
  tocContainer.id = 'dt-toc';
  tocContainer.className = 'dt-toc-container';

  const title = document.createElement('div');
  title.className = 'dt-toc-title';
  title.textContent = 'Table of Contents';
  tocContainer.appendChild(title);

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
    
    // Smooth scroll
    link.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
    });

    item.appendChild(link);
    list.appendChild(item);
  });

  tocContainer.appendChild(list);

  // Injection Strategy
  // If right sidebar exists (even if hidden by our CSS), we can inject INSIDE it (replacing content) 
  // OR inject it into the main layout grid if sidebar is missing.
  
  if (rightSidebar) {
    // We want the ToC to be visible even if the sidebar is "cleaned" via CSS (display: none).
    // So we force the sidebar to be visible BUT strictly for our ToC content.
    // However, our CSS hides the sidebar ID entirely. 
    // Best approach: Inject ToC into the layout wrapper as a new column or absolute/fixed element?
    // Easiest approach for Grid: Inject into the right-sidebar slot but override the display property for our element.
    
    // Actually, if we hide #sidebar-wrapper-right, everything inside is gone.
    // Let's create a NEW container in the grid if possible, or append to body and use fixed positioning.
    // BUT, the prompt asks for "Sticky ToC to the right sidebar".
    
    // Strategy: We append it to the grid container (.crayons-layout) and give it the right-sidebar styling/grid position.
    const layout = document.querySelector('.crayons-layout');
    if (layout) {
      tocContainer.style.gridColumn = '3'; // Typically the 3rd column
      tocContainer.style.gridRow = '1 / 99'; // Span rows
      layout.appendChild(tocContainer);
    }
  }
}