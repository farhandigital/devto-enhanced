/**
 * Feature Registry
 * Central management for all extension features
 */

import type { ExtensionSettings } from '@/types/settings';
import type { Feature, FeatureContext } from '@/types/feature';

/**
 * Registry of all features
 * Add new features here to automatically include them in the extension
 */
const features: Feature[] = [];

/**
 * Register a feature with the extension
 */
export function registerFeature(feature: Feature): void {
  const existing = features.find((f) => f.name === feature.name);
  if (existing) {
    console.warn(
      `Feature "${feature.name}" is already registered. Skipping duplicate.`
    );
    return;
  }
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
export function getFeaturesForContext(context: FeatureContext): Feature[] {
  return features.filter((feature) => feature.context.includes(context));
}

/**
 * Get features for UI display grouped by context
 */
export function getUIFeatures() {
  return {
    global: features.filter((f) => f.context.includes('global')),
    home: features.filter(
      (f) => f.context.includes('home') && !f.context.includes('global')
    ),
    article: features.filter(
      (f) => f.context.includes('article') && !f.context.includes('global')
    ),
  };
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
    try {
      feature.execute(settings);
    } catch (error) {
      console.error(`Failed to execute feature "${feature.name}":`, error);
    }
  });

  // Then execute context-specific features
  getFeaturesForContext(pageType).forEach((feature) => {
    try {
      feature.execute(settings);
    } catch (error) {
      console.error(`Failed to execute feature "${feature.name}":`, error);
    }
  });
}
