import type { ExtensionSettings } from '@/utils/types';

export function renderTableOfContents(settings: ExtensionSettings) {
  const existingToC = document.getElementById('dt-toc');
  const rightSidebar = document.querySelector('.crayons-layout__sidebar-right');
  const articleBody = document.querySelector('#article-body');

  // Remove if exists (re-render or disable)
  if (existingToC) existingToC.remove();

  if (!settings.article.showToC || !articleBody) return;

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
    
    // Smooth scroll
    link.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
    });

    item.appendChild(link);
    list.appendChild(item);
  });

  tocInner.appendChild(list);
  tocContainer.appendChild(tocInner);

  // Inject ToC as the first item in the right sidebar
  rightSidebar.insertBefore(tocContainer, rightSidebar.firstChild);
}