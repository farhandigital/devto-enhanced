/**
 * Reading Stats Feature
 * Displays word count and estimated reading time
 */

import type { ExtensionSettings } from '@/types/settings';
import { Selectors } from '@/config/selectors';

/**
 * Render a reading-stats widget (word count and estimated read time) for the current article.
 *
 * If present, an existing stats element with id "dt-reading-stats" is removed before rendering.
 * The widget is not rendered when required DOM elements are missing or when `settings.article.showReadingStats` is falsy.
 *
 * @param settings - Extension settings that control whether reading stats are shown; the rendering is enabled when `settings.article.showReadingStats` is truthy
 */
export function renderReadingStats(settings: ExtensionSettings) {
  const articleBody = document.querySelector(Selectors.article.bodyId);
  const title = document.querySelector(Selectors.article.titleHeader);
  const existingStats = document.getElementById('dt-reading-stats');

  if (!articleBody || !title) return;

  // Remove existing if setting disabled or updating
  if (existingStats) {
    existingStats.remove();
  }

  if (!settings.article.showReadingStats) return;

  const text = articleBody.textContent || '';
  const trimmedText = text.trim();
  const wordCount = trimmedText ? trimmedText.split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 225); // ~225 WPM

  const statsContainer = document.createElement('div');
  statsContainer.id = 'dt-reading-stats';
  statsContainer.className = 'dt-reading-stats';

  const wordBadge = document.createElement('span');
  wordBadge.className = 'dt-stat-badge';
  wordBadge.textContent = `📝 ${wordCount.toLocaleString()} words`;

  const timeBadge = document.createElement('span');
  timeBadge.className = 'dt-stat-badge';
  timeBadge.textContent = `⏱️ ${readTime} min read`;

  statsContainer.appendChild(wordBadge);
  statsContainer.appendChild(timeBadge);

  title.insertAdjacentElement('afterend', statsContainer);
}