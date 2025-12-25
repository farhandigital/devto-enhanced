export interface ExtensionSettings {
  // Article Page Features
  article: {
    hideLeftSidebar: boolean;
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
  article: {
    hideLeftSidebar: true,
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