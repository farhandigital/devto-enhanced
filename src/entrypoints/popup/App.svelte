<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { getSettingValue, getUIFeatureGroups } from "@/features/core/registry";
import type { ExtensionSettings, FeatureGroup, FeatureMetadata } from "@/types";
import { DEFAULT_SETTINGS } from "@/types";
import { settingsStorage, updateSetting } from "@/utils/storage";
import iconUrl from "/icon.png";

let settings = $state<ExtensionSettings>(DEFAULT_SETTINGS);
let unwatch: (() => void) | undefined;
let loadError = $state<string | null>(null);
let isLoading = $state(true);

// Feature groups are dynamically generated from the registry
let featureGroups = $state<FeatureGroup[]>([]);

// Initialize feature groups lazily
function initializeFeatureGroups() {
	// Import feature definitions to trigger registration, then get groups
	import("@/features/definitions")
		.then(() => {
			featureGroups = getUIFeatureGroups();
		})
		.catch((error) => {
			console.error("Failed to load feature definitions:", error);
		});
}

onMount(async () => {
	// Initialize feature groups
	initializeFeatureGroups();

	try {
		settings = await settingsStorage.getValue();
		loadError = null;
	} catch (error) {
		console.error("Failed to load settings from storage:", error);
		loadError = "Failed to load settings. Using default values.";
		settings = DEFAULT_SETTINGS;
	} finally {
		isLoading = false;
	}

	// Watch for external changes
	unwatch = settingsStorage.watch((newVal) => {
		if (newVal) {
			settings = newVal;
		}
	});
});

onDestroy(() => {
	if (unwatch) {
		try {
			unwatch();
		} catch (error) {
			console.error("Failed to cleanup storage watcher:", error);
		}
	}
});

async function handleToggle(feature: FeatureMetadata, e: Event) {
	const target = e.target as HTMLInputElement;
	const { section, key } = feature.settingKey;
	try {
		await updateSetting(
			section,
			key as keyof ExtensionSettings[typeof section],
			target.checked,
		);
	} catch (error) {
		console.error("Failed to update setting:", error);
		target.checked = !target.checked;
	}
}

function getEmoji(featureType: "hide" | "add"): string {
	return featureType === "hide" ? "🧹" : "⚡";
}

function getPrefix(featureType: "hide" | "add"): string {
	return featureType === "hide" ? "Hide" : "Add";
}

function isFeatureEnabled(feature: FeatureMetadata): boolean {
	// Use the feature's own isEnabled check if available
	if (feature.isEnabled) {
		return feature.isEnabled(settings);
	}
	return true;
}

function getDisabledTooltip(feature: FeatureMetadata): string | null {
	// Use the feature's own tooltip if available
	if (feature.disabledTooltip) {
		return feature.disabledTooltip(settings);
	}
	return null;
}
</script>

<main>
  <div class="header">
    <img src={iconUrl} alt="dev.to Enhanced" class="logo" />
    <h2>dev.to Enhanced</h2>
  </div>

  {#if loadError}
    <div class="error-banner" role="alert">
      {loadError}
    </div>
  {/if}

  {#if isLoading}
    <div class="loading-state">Loading settings...</div>
  {:else}
    <div class="legend">
      <span class="legend-item"
        ><span class="emoji">{getEmoji("hide")}</span>
        <span class="prefix">{getPrefix("hide")}</span> clutter</span
      >
      <span class="legend-item"
        ><span class="emoji">{getEmoji("add")}</span>
        <span class="prefix">{getPrefix("add")}</span> features</span
      >
    </div>

    {#each featureGroups as group (group.context)}
      <section>
        <h3>{group.title}</h3>
        {#each group.features as feature (feature.name)}
          {@const enabled = isFeatureEnabled(feature)}
          {@const tooltip = getDisabledTooltip(feature)}
          <div class="toggle-row" class:disabled={!enabled}>
            <span
              class="toggle-label"
              id="{group.context}-{feature.settingKey.key}-label"
            >
              <span class="emoji">{getEmoji(feature.type)}</span>
              <span class="prefix">{getPrefix(feature.type)}</span>
              {feature.label}
              {#if tooltip}
                <span class="tooltip-icon" title={tooltip}>ℹ️</span>
              {/if}
            </span>
            <label class="switch" for="{group.context}-{feature.settingKey.key}">
              <input
                type="checkbox"
                id="{group.context}-{feature.settingKey.key}"
                checked={getSettingValue(settings, feature.settingKey)}
                onchange={(e) => handleToggle(feature, e)}
                aria-labelledby="{group.context}-{feature.settingKey.key}-label"
                disabled={!enabled}
              />
              <span class="slider" aria-hidden="true"></span>
            </label>
          </div>
        {/each}
      </section>
    {/each}
  {/if}
</main>
