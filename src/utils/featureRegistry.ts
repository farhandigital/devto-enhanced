import type { ExtensionSettings } from '@/utils/types';

/**
 * Feature interface for all extension features
 */
export interface Feature {
  /** Unique identifier for the feature */
  name: string;
  
  /** Context(s) where this feature should run */
  context: readonly ('global' | 'article' | 'home' | 'other')[];
  
  /** Execute the feature with current settings */
  execute: (settings: ExtensionSettings) => void;
  
  /** Optional cleanup function called when feature is disabled or context changes */
  cleanup?: () => void;
}

/**
 * Registry of all features
 * Add new features here to automatically include them in the extension
 */
const features: Feature[] = [];

/**
 * Register a feature with the extension
 */
export function registerFeature(feature: Feature): void {
  features.push(feature);
}

/**
 * Get all registered features
 */
export function getAllFeatures(): readonly Feature[] {
  return features;
}

/**
 * Get features applicable to a specific context
 */
export function getFeaturesForContext(
  context: 'global' | 'article' | 'home' | 'other'
): Feature[] {
  return features.filter((feature) => feature.context.includes(context));
}

/**
 * Execute all features for the current page context
 */
export function executeFeatures(
  pageType: 'article' | 'home' | 'other',
  settings: ExtensionSettings
): void {
  // Execute global features first
  getFeaturesForContext('global').forEach((feature) => {
    feature.execute(settings);
  });
  
  // Then execute context-specific features
  getFeaturesForContext(pageType).forEach((feature) => {
    feature.execute(settings);
  });
}
