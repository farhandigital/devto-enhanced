import type { ExtensionSettings } from '@/utils/types';
import { Selectors } from '@/utils/selectors';

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
          if (!el.parentElement || el.parentElement.tagName.toLowerCase() !== 'pre') {
            parts.push('`' + (el.textContent || '') + '`');
          } else {
            // Block code - handled by pre
            parts.push(el.textContent || '');
          }
          break;
        case 'pre':
          // Code block
          const codeEl = el.querySelector('code');
          if (codeEl) {
            parts.push('\n```\n' + (codeEl.textContent || '') + '\n```\n');
          } else {
            parts.push('\n' + (el.textContent || '') + '\n');
          }
          break;
        case 'ul':
        case 'ol':
          parts.push('\n' + extractList(el, tagName) + '\n');
          break;
        case 'li':
          // Handled by parent ul/ol
          parts.push(extractFormattedText(el));
          break;
        case 'a':
          const href = el.getAttribute('href');
          const linkText = extractFormattedText(el);
          if (href && href !== '#' && !href.startsWith('#')) {
            parts.push(`[${linkText}](${href})`);
          } else {
            parts.push(linkText);
          }
          break;
        case 'hr':
          parts.push('\n---\n');
          break;
        case 'blockquote':
          const quoteText = extractFormattedText(el);
          parts.push('\n> ' + quoteText.split('\n').join('\n> ') + '\n');
          break;
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
  
  // Extract article body
  const articleBody = document.querySelector(Selectors.article.bodyId);
  if (articleBody) {
    const content = extractFormattedText(articleBody);
    // Clean up excessive newlines
    const cleaned = content
      .replace(/\n{3,}/g, '\n\n')
      .trim();
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
 * Shows a temporary notification
 */
function showNotification(message: string, success: boolean = true) {
  const notification = document.createElement('div');
  notification.className = 'dt-copy-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${success ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: dt-slide-in 0.3s ease-out;
  `;
  
  // Add animation keyframes if not already added
  if (!document.querySelector('#dt-copy-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'dt-copy-notification-styles';
    style.textContent = `
      @keyframes dt-slide-in {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'dt-slide-in 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
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
  const titleHeader = document.querySelector('header#main-title');
  if (!titleHeader) return;
  
  const tagsContainer = titleHeader.querySelector('.spec__tags');
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
      showNotification('✓ Article copied to clipboard!');
    } else {
      showNotification('✗ Failed to copy article', false);
    }
  };
  
  // Insert button after tags or title
  insertionPoint.insertAdjacentElement('afterend', button);
}
