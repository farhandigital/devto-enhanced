/**
 * Feature registration file
 * Import and register all features here for automatic orchestration
 */

import { registerFeature } from '@/utils/featureRegistry';
import { applyLayoutCleaning } from '@/utils/features/layoutCleaner';
import { handleEngagementButtons } from '@/utils/features/articleActionMover';
import { renderReadingStats } from '@/utils/features/readingStats';
import { renderTableOfContents } from '@/utils/features/tocGenerator';
import { renderCopyArticleButton } from '@/utils/features/copyArticle';

// Register hide subforem switcher (global)
registerFeature({
  name: 'hideSubforemSwitcher',
  context: ['global'],
  type: 'hide',
  settingKey: { section: 'global', key: 'hideSubforemSwitcher' },
  label: 'Subforem Switcher',
  execute: applyLayoutCleaning,
});

// Register hide left sidebar (home)
registerFeature({
  name: 'hideLeftSidebar',
  context: ['home'],
  type: 'hide',
  settingKey: { section: 'home', key: 'hideLeftSidebar' },
  label: 'Left Sidebar',
  execute: applyLayoutCleaning,
});

// Register hide right sidebar (home)
registerFeature({
  name: 'hideRightSidebarHome',
  context: ['home'],
  type: 'hide',
  settingKey: { section: 'home', key: 'hideRightSidebar' },
  label: 'Right Sidebar',
  execute: applyLayoutCleaning,
});

// Register hide right sidebar (article)
registerFeature({
  name: 'hideRightSidebarArticle',
  context: ['article'],
  type: 'hide',
  settingKey: { section: 'article', key: 'hideRightSidebar' },
  label: 'Right Sidebar',
  execute: applyLayoutCleaning,
});

// Register engagement button mover (article-only feature)
registerFeature({
  name: 'engagementButtonMover',
  context: ['article'],
  type: 'hide',
  settingKey: { section: 'article', key: 'moveEngagement' },
  label: 'Move Engagement Buttons',
  execute: handleEngagementButtons,
});

// Register reading stats (article-only feature)
registerFeature({
  name: 'readingStats',
  context: ['article'],
  type: 'add',
  settingKey: { section: 'article', key: 'showReadingStats' },
  label: 'Reading Stats',
  execute: renderReadingStats,
});

// Register table of contents (article-only feature)
registerFeature({
  name: 'tableOfContents',
  context: ['article'],
  type: 'add',
  settingKey: { section: 'article', key: 'showToC' },
  label: 'Sticky Table of Contents',
  execute: renderTableOfContents,
});

// Register copy article button (article-only feature)
registerFeature({
  name: 'copyArticleButton',
  context: ['article'],
  type: 'add',
  settingKey: { section: 'article', key: 'showCopyButton' },
  label: 'Copy Article Button',
  execute: renderCopyArticleButton,
});
