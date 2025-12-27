/**
 * Feature registration file
 * Import and register all features here for automatic orchestration
 */

import { registerFeature } from '@/features/registry';
import { applyLayoutCleaning } from '@/features/layoutCleaner';
import { handleEngagementButtons } from '@/features/articleActionMover';
import { renderReadingStats } from '@/features/readingStats';
import { renderTableOfContents } from '@/features/tocGenerator';
import { renderCopyArticleButton } from '@/features/copyArticle';
import { handleArticleCentering } from '@/features/articleCentering';

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

// Register article centering (article-only feature)
// Only activates when both sidebars hidden + ToC disabled
registerFeature({
  name: 'centerArticle',
  context: ['article'],
  type: 'add',
  settingKey: { section: 'article', key: 'centerArticle' },
  label: 'Center Article',
  execute: handleArticleCentering,
});
