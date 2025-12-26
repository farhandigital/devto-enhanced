/**
 * Feature registration file
 * Import and register all features here for automatic orchestration
 */

import { registerFeature } from '@/utils/featureRegistry';
import { applyLayoutCleaning } from '@/utils/features/layoutCleaner';
import { handleEngagementButtons } from '@/utils/features/articleActionMover';
import { renderReadingStats } from '@/utils/features/readingStats';
import { renderTableOfContents } from '@/utils/features/tocGenerator';
import { renderCopyArticleButton } from '@/utils/features/articleCopy';

// Register layout cleaner (global feature)
registerFeature({
  name: 'layoutCleaner',
  context: ['global'],
  execute: applyLayoutCleaning,
});

// Register engagement button mover (article-only feature)
registerFeature({
  name: 'engagementButtonMover',
  context: ['article'],
  execute: handleEngagementButtons,
});

// Register reading stats (article-only feature)
registerFeature({
  name: 'readingStats',
  context: ['article'],
  execute: renderReadingStats,
});

// Register table of contents (article-only feature)
registerFeature({
  name: 'tableOfContents',
  context: ['article'],
  execute: renderTableOfContents,
});

// Register copy article button (article-only feature)
registerFeature({
  name: 'copyArticleButton',
  context: ['article'],
  execute: renderCopyArticleButton,
});
