import type { ExtensionSettings } from '@/utils/types';
import { Selectors } from '@/utils/selectors';

/**
 * Configuration for elements that can be hidden via settings
 * Declarative approach: add a new entry here to support hiding a new element
 */

export interface HideableElement {
  /** CSS selector to target */
  selector: string;
  /** Path to the setting that controls this element (e.g., 'global.hideSubforemSwitcher') */
  settingPath: string;
  /** CSS class to apply when hiding is enabled */
  cssClass: string;
  /** Context where this element should be hidden */
  context: 'global' | 'article' | 'home';
}

/**
 * Declarative configuration for all hideable elements
 * To add a new hideable element:
 * 1. Add an entry here
 * 2. Add corresponding CSS in devto.css
 * 3. Add the setting to types.ts
 */
export const HIDEABLE_ELEMENTS: readonly HideableElement[] = [
  // Global elements (visible on all pages)
  {
    selector: Selectors.global.subforemSwitcher,
    settingPath: 'global.hideSubforemSwitcher',
    cssClass: 'dt-hide-subforem',
    context: 'global',
  },
  
  // Article page elements
  {
    selector: Selectors.layout.rightSidebar,
    settingPath: 'article.hideRightSidebar',
    cssClass: 'dt-clean-right',
    context: 'article',
  },
  
  // Home page elements
  {
    selector: Selectors.layout.leftSidebar,
    settingPath: 'home.hideLeftSidebar',
    cssClass: 'dt-clean-left',
    context: 'home',
  },
  {
    selector: Selectors.layout.rightSidebar,
    settingPath: 'home.hideRightSidebar',
    cssClass: 'dt-clean-right',
    context: 'home',
  },
] as const;

/**
 * Helper to get setting value from nested path
 */
export function getSettingValue(
  settings: ExtensionSettings,
  path: string
): boolean {
  const [section, key] = path.split('.') as [
    keyof ExtensionSettings,
    string
  ];
  return settings[section][key as keyof typeof settings[typeof section]] as boolean;
}
