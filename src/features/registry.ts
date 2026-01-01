/**
 * Feature Registry
 * Central management for all extension features
 */

import type { Feature, FeatureContext } from "@/types/feature";
import type { ExtensionSettings } from "@/types/settings";

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
			`Feature "${feature.name}" is already registered. Skipping duplicate.`,
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
 * Feature metadata (without execute and cleanup functions)
 * Used for lightweight UI display in popup
 */
export type FeatureMetadata = Omit<Feature, "execute" | "cleanup">;

/**
 * Get features for UI display grouped by context
 * @deprecated Use getUIFeaturesMetadata() instead for popup UI
 */
export function getUIFeatures() {
	return {
		global: features.filter((f) => f.context.includes("global")),
		home: features.filter(
			(f) => f.context.includes("home") && !f.context.includes("global"),
		),
		article: features.filter(
			(f) => f.context.includes("article") && !f.context.includes("global"),
		),
	};
}

/**
 * Get feature metadata for UI display grouped by context
 * Returns only the metadata without execute functions for lightweight popup use
 */
export function getUIFeaturesMetadata(): {
	global: FeatureMetadata[];
	home: FeatureMetadata[];
	article: FeatureMetadata[];
	postEditor: FeatureMetadata[];
} {
	const toMetadata = (f: Feature): FeatureMetadata => ({
		name: f.name,
		context: f.context,
		type: f.type,
		settingKey: f.settingKey,
		label: f.label,
	});

	return {
		global: features
			.filter((f) => f.context.includes("global"))
			.map(toMetadata),
		home: features
			.filter(
				(f) => f.context.includes("home") && !f.context.includes("global"),
			)
			.map(toMetadata),
		article: features
			.filter(
				(f) => f.context.includes("article") && !f.context.includes("global"),
			)
			.map(toMetadata),
		postEditor: features
			.filter(
				(f) =>
					f.context.includes("postEditor") && !f.context.includes("global"),
			)
			.map(toMetadata),
	};
}

/**
 * Execute all features for the current page context
 */
export function executeFeatures(
	pageType: "article" | "home" | "postEditor" | "other",
	settings: ExtensionSettings,
): void {
	// Execute global features first
	getFeaturesForContext("global").forEach((feature) => {
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
