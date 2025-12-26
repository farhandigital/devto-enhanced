export interface ExtensionSettings {
  // Global Features (all pages)
  global: {
    hideSubforemSwitcher: boolean;
  };
  // Article Page Features
  article: {
    hideRightSidebar: boolean;
    moveEngagement: boolean;
    showToC: boolean;
    showReadingStats: boolean;
  };
  // Homepage Features
  home: {
    hideLeftSidebar: boolean;
    hideRightSidebar: boolean;
  };
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  global: {
    hideSubforemSwitcher: true,
  },
  article: {
    hideRightSidebar: true,
    moveEngagement: true,
    showToC: true,
    showReadingStats: true,
  },
  home: {
    hideLeftSidebar: true,
    hideRightSidebar: true,
  },
};