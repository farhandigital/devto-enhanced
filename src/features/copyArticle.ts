/**
 * Copy Article Feature
 * Allows copying article content in Markdown format
 */

import type { ExtensionSettings } from '@/types';
import { Selectors } from '@/config/selectors';

/**
 * Extracts text content from an element while preserving formatting
 */
function extractFormattedText(element: Element): string {
  const parts: string[] = [];

  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        parts.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      // Handle different element types
      switch (tagName) {
        case 'br':
          parts.push('\n');
          break;
        case 'p':
          parts.push('\n' + extractFormattedText(el) + '\n');
          break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          parts.push('\n' + extractFormattedText(el) + '\n');
          break;
        case 'strong':
        case 'b':
          parts.push('**' + extractFormattedText(el) + '**');
          break;
        case 'em':
        case 'i':
          parts.push('*' + extractFormattedText(el) + '*');
          break;
        case 'code':
          // Inline code
          if (
            !el.parentElement ||
            el.parentElement.tagName.toLowerCase() !== 'pre'
          ) {
            parts.push('`' + (el.textContent || '') + '`');
          } else {
            // Block code - handled by pre
            parts.push(el.textContent || '');
          }
          break;
        case 'pre': {
          // Code block
          const codeEl = el.querySelector('code');
          if (codeEl) {
            parts.push('\n```\n' + (codeEl.textContent || '') + '\n```\n');
          } else {
            parts.push('\n' + (el.textContent || '') + '\n');
          }
          break;
        }
        case 'ul':
        case 'ol':
          parts.push('\n' + extractList(el, tagName) + '\n');
          break;
        case 'li':
          // Handled by parent ul/ol
          parts.push(extractFormattedText(el));
          break;
        case 'a': {
          const href = el.getAttribute('href');
          const linkText = extractFormattedText(el);
          if (href && href !== '#' && !href.startsWith('#')) {
            parts.push(`[${linkText}](${href})`);
          } else {
            parts.push(linkText);
          }
          break;
        }
        case 'hr':
          parts.push('\n---\n');
          break;
        case 'blockquote': {
          const quoteText = extractFormattedText(el);
          parts.push('\n> ' + quoteText.split('\n').join('\n> ') + '\n');
          break;
        }
        default:
          // For other elements, recursively extract
          parts.push(extractFormattedText(el));
          break;
      }
    }
  }

  return parts.join('');
}

/**
 * Extracts list items with proper formatting
 */
function extractList(listEl: Element, type: string): string {
  const items: string[] = [];
  const listItems = listEl.querySelectorAll(':scope > li');

  listItems.forEach((li, index) => {
    const prefix = type === 'ol' ? `${index + 1}. ` : '- ';
    const text = extractFormattedText(li).trim();
    items.push(prefix + text);
  });

  return items.join('\n');
}

/**
 * Extracts the full article content with formatting
 */
function extractArticleContent(): string {
  const parts: string[] = [];

  // Extract title
  const titleEl = document.querySelector(Selectors.article.titleHeader);
  if (titleEl) {
    parts.push('# ' + titleEl.textContent?.trim() + '\n');
  }

  // Extract metadata (author and URL)
  const metadata: string[] = [];

  // Extract author
  const authorEl = document.querySelector(Selectors.article.authorLink);
  if (authorEl) {
    const authorName = authorEl.textContent?.trim();
    const authorHref = authorEl.getAttribute('href');
    if (authorName && authorHref) {
      const authorUrl = authorHref.startsWith('http')
        ? authorHref
        : `https://dev.to${authorHref}`;
      metadata.push(`**Author:** [${authorName}](${authorUrl})`);
    }
  }

  // Extract article URL
  const articleUrl = window.location.href;
  metadata.push(`**URL:** ${articleUrl}`);

  if (metadata.length > 0) {
    parts.push(metadata.join('  \n') + '\n');
  }

  // Extract article body
  const articleBody = document.querySelector(Selectors.article.bodyId);
  if (articleBody) {
    const content = extractFormattedText(articleBody);
    // Clean up excessive newlines
    const cleaned = content.replace(/\n{3,}/g, '\n\n').trim();
    parts.push(cleaned);
  }

  return parts.join('\n');
}

/**
 * Copies text to clipboard
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Renders the copy article button
 */
export function renderCopyArticleButton(settings: ExtensionSettings) {
  const existingButton = document.getElementById('dt-copy-article-btn');

  // Remove existing button
  if (existingButton) {
    existingButton.remove();
  }

  // Check if feature is enabled
  if (!settings.article.showCopyButton) return;

  // Find insertion point (after tags or after title)
  const titleHeader = document.querySelector(
    Selectors.article.titleHeaderContainer
  );
  if (!titleHeader) return;

  const tagsContainer = titleHeader.querySelector(Selectors.article.tagsContainer);
  const insertionPoint = tagsContainer || titleHeader.querySelector('h1');

  if (!insertionPoint) return;

  // Create button
  const button = document.createElement('button');
  button.id = 'dt-copy-article-btn';
  button.className = 'dt-copy-article-btn';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    Copy Article
  `;

  button.onclick = async () => {
    const content = extractArticleContent();
    const success = await copyToClipboard(content);

    if (success) {
      // Change button to success state
      button.classList.add('dt-copy-success');
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;

      // Reset button after 2 seconds
      setTimeout(() => {
        button.classList.remove('dt-copy-success');
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Article
        `;
      }, 2000);
    } else {
      // Show error state briefly
      button.classList.add('dt-copy-error');
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        Failed
      `;

      setTimeout(() => {
        button.classList.remove('dt-copy-error');
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Article
        `;
      }, 2000);
    }
  };

  // Insert button after tags or title
  insertionPoint.insertAdjacentElement('afterend', button);
}
