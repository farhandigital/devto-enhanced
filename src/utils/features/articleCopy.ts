import type { ExtensionSettings } from '@/utils/types';
import { PageDetector } from '@/utils/pageDetector';
import { Selectors } from '@/utils/selectors';

export function renderCopyArticleButton(settings: ExtensionSettings) {
  if (!PageDetector.isArticle()) return;
  if (!settings.article.showCopyButton) return;

  // Check if button already exists
  if (document.querySelector('.dt-copy-article-btn')) return;

  const titleHeader = document.querySelector(Selectors.article.titleHeader);
  if (!titleHeader) return;

  // Create the button
  const copyButton = document.createElement('button');
  copyButton.className = 'crayons-btn crayons-btn--secondary dt-copy-article-btn';
  copyButton.textContent = 'Copy Article';
  copyButton.style.marginTop = '1rem';
  copyButton.setAttribute('aria-label', 'Copy article content to clipboard');

  // Add click handler
  copyButton.addEventListener('click', async () => {
    try {
      const articleContent = extractArticleContent();
      await navigator.clipboard.writeText(articleContent);
      
      // Provide feedback
      const originalText = copyButton.textContent;
      copyButton.textContent = '✓ Copied!';
      copyButton.classList.add('crayons-btn--success');
      
      setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.classList.remove('crayons-btn--success');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy article:', error);
      copyButton.textContent = '✗ Failed';
      setTimeout(() => {
        copyButton.textContent = 'Copy Article';
      }, 2000);
    }
  });

  // Check if engagement buttons are moved
  const actionsContainer = document.querySelector<HTMLElement>(Selectors.article.actions);
  const isEngagementMoved = actionsContainer?.classList.contains('dt-engagement-moved');

  if (isEngagementMoved && settings.article.moveEngagement && actionsContainer) {
    // Place beside engagement actions in a flex container
    let buttonContainer = actionsContainer.parentElement?.querySelector<HTMLDivElement>('.dt-copy-button-container');
    
    if (!buttonContainer) {
      buttonContainer = document.createElement('div');
      buttonContainer.className = 'dt-copy-button-container';
      buttonContainer.style.cssText = 'display: flex; gap: 0.5rem; align-items: center; margin-top: 1rem;';
      
      // Insert after the h1
      if (titleHeader.parentElement) {
        titleHeader.parentElement.insertBefore(buttonContainer, titleHeader.nextElementSibling);
      }
      
      // Move actions container into the new container
      buttonContainer.appendChild(actionsContainer);
    }
    
    // Add copy button to the container
    buttonContainer.appendChild(copyButton);
  } else {
    // Place after the h1 title
    if (titleHeader.parentElement) {
      titleHeader.parentElement.insertBefore(copyButton, titleHeader.nextElementSibling);
    }
  }
}

/**
 * Extract article content in markdown-like format
 */
function extractArticleContent(): string {
  const articleBody = document.querySelector(Selectors.article.bodyId);
  if (!articleBody) return '';

  // Get the title
  const titleElement = document.querySelector(Selectors.article.titleHeader);
  const title = titleElement?.textContent?.trim() || 'Untitled';

  // Get author info
  const authorLink = document.querySelector('.crayons-article__header__meta a[href^="/"]');
  const authorName = authorLink?.textContent?.trim() || 'Unknown Author';

  // Get tags
  const tagElements = document.querySelectorAll('.spec__tags a.crayons-tag');
  const tags = Array.from(tagElements)
    .map(tag => tag.textContent?.trim() || '')
    .filter(Boolean)
    .join(' ');

  let content = `# ${title}\n\n`;
  content += `**Author:** ${authorName}\n`;
  if (tags) {
    content += `**Tags:** ${tags}\n`;
  }
  content += `\n---\n\n`;

  // Extract article body content
  const bodyText = extractTextContent(articleBody);
  content += bodyText;

  return content;
}

/**
 * Extract text content while preserving structure
 */
function extractTextContent(element: Element): string {
  let result = '';

  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        result += text + '\n';
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      
      // Handle headings
      if (el.tagName.match(/^H[1-6]$/)) {
        const level = parseInt(el.tagName[1]);
        const prefix = '#'.repeat(level);
        result += `\n${prefix} ${el.textContent?.trim()}\n\n`;
      }
      // Handle code blocks
      else if (el.tagName === 'PRE') {
        const code = el.querySelector('code');
        if (code) {
          result += '\n```\n' + code.textContent + '\n```\n\n';
        }
      }
      // Handle inline code
      else if (el.tagName === 'CODE' && el.parentElement?.tagName !== 'PRE') {
        result += '`' + el.textContent + '`';
      }
      // Handle paragraphs
      else if (el.tagName === 'P') {
        result += el.textContent?.trim() + '\n\n';
      }
      // Handle lists
      else if (el.tagName === 'LI') {
        result += '- ' + el.textContent?.trim() + '\n';
      }
      // Handle blockquotes
      else if (el.tagName === 'BLOCKQUOTE') {
        const lines = el.textContent?.trim().split('\n') || [];
        result += lines.map(line => '> ' + line).join('\n') + '\n\n';
      }
      // Handle horizontal rules
      else if (el.tagName === 'HR') {
        result += '\n---\n\n';
      }
      // Handle links
      else if (el.tagName === 'A') {
        const href = el.getAttribute('href');
        const text = el.textContent?.trim();
        if (href && text) {
          result += `[${text}](${href})`;
        }
      }
      // Handle strong/bold
      else if (el.tagName === 'STRONG' || el.tagName === 'B') {
        result += `**${el.textContent?.trim()}**`;
      }
      // Handle emphasis/italic
      else if (el.tagName === 'EM' || el.tagName === 'I') {
        result += `*${el.textContent?.trim()}*`;
      }
      // Skip certain elements
      else if (el.classList.contains('highlight__panel') || 
               el.classList.contains('js-billboard-container')) {
        continue;
      }
      // Recurse for other elements
      else {
        result += extractTextContent(el);
      }
    }
  }

  return result;
}
