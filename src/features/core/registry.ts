/**
 * Feature Registry
 * Central management for all extension features
 *
 * Features self-register by being imported - no manual coordination needed
 */

import type {
	ExtensionSettings,
	FeatureDefinition,
	FeatureGroup,
	FeatureGroupContext,
	FeatureMetadata,
	PageContext,
} from "@/types";
import { ORDERED_CONTEXTS, UI_CONTEXT_TITLES } from "@/types";

/**
 * Internal registry storage
 */
const features: FeatureDefinition[] = [];

/**
 * Register a feature with the extension
 * Called by feature definition files when imported
 */
export function registerFeature(feature: FeatureDefinition): void {
	const existing = features.find((f) => f.name === feature.name);
	if (existing) {
		// In development, features may be re-registered due to HMR
		// Replace instead of warn
		const index = features.indexOf(existing);
		features[index] = feature;
		return;
	}
	features.push(feature);
}

/**
 * Get features applicable to a specific context
 */
function getFeaturesForContext(context: PageContext): FeatureDefinition[] {
	return features.filter((feature) => feature.context.includes(context));
}

/**
 * Convert a feature definition to metadata (strips execute/cleanup)
 */
function toMetadata(feature: FeatureDefinition): FeatureMetadata {
	return {
		name: feature.name,
		context: feature.context,
		type: feature.type,
		settingKey: feature.settingKey,
		label: feature.label,
		isEnabled: feature.isEnabled,
		disabledTooltip: feature.disabledTooltip,
	};
}

/**
 * Get feature metadata for UI display, dynamically grouped by context
 * Returns only metadata without execute functions for lightweight popup use
 */
export function getUIFeatureGroups(): FeatureGroup[] {
	// Get all unique contexts from registered features (excluding "other")
	const contexts = new Set<FeatureGroupContext>();
	for (const feature of features) {
		for (const ctx of feature.context) {
			if (ctx !== "other") {
				contexts.add(ctx as FeatureGroupContext);
			}
		}
	}

	// Build groups dynamically
	const groups: FeatureGroup[] = [];

	for (const context of ORDERED_CONTEXTS) {
		if (!contexts.has(context)) continue;

		const contextFeatures = features.filter((f) => {
			// Global features only appear in global group
			if (context === "global") {
				return f.context.includes("global");
			}
			// Non-global features: include if they have this context but not global
			return f.context.includes(context) && !f.context.includes("global");
		});

		if (contextFeatures.length > 0) {
			groups.push({
				context,
				title: UI_CONTEXT_TITLES[context],
				features: contextFeatures.map(toMetadata),
			});
		}
	}

	return groups;
}

/**
 * Execute all features for the current page context
 */
export function executeFeatures(
	pageContext: PageContext,
	settings: ExtensionSettings,
): void {
	// Execute global features first
	getFeaturesForContext("global").forEach((feature) => {
		if (feature.execute) {
			try {
				feature.execute(settings);
			} catch (error) {
				console.error(`Failed to execute feature "${feature.name}":`, error);
			}
		}
	});

	// Then execute context-specific features (skip if already handled as global)
	if (pageContext !== "global" && pageContext !== "other") {
		getFeaturesForContext(pageContext).forEach((feature) => {
			// Skip if this feature is global (already executed)
			if (feature.context.includes("global")) return;

			if (feature.execute) {
				try {
					feature.execute(settings);
				} catch (error) {
					console.error(`Failed to execute feature "${feature.name}":`, error);
				}
			}
		});
	}
}

/**
 * Get setting value from a feature's settingKey
 */
export function getSettingValue(
	settings: ExtensionSettings,
	settingKey: FeatureDefinition["settingKey"],
): boolean {
	const section = settings[settingKey.section];
	return section[settingKey.key as keyof typeof section] as boolean;
}
