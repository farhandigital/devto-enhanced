import type { ExtensionSettings } from '@/utils/types';

export function renderReadingStats(settings: ExtensionSettings) {
  const articleBody = document.querySelector('#article-body');
  const title = document.querySelector('h1');
  const existingStats = document.getElementById('dt-reading-stats');

  if (!articleBody || !title) return;

  // Remove existing if setting disabled or updating
  if (existingStats) {
    existingStats.remove();
  }

  if (!settings.article.showReadingStats) return;

  const text = articleBody.textContent || '';
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 225); // ~225 WPM

  const statsContainer = document.createElement('div');
  statsContainer.id = 'dt-reading-stats';
  statsContainer.className = 'dt-reading-stats';
  
  statsContainer.innerHTML = `
    <span class="dt-stat-badge">📝 ${wordCount.toLocaleString()} words</span>
    <span class="dt-stat-badge">⏱️ ${readTime} min read</span>
  `;

  title.insertAdjacentElement('afterend', statsContainer);
}