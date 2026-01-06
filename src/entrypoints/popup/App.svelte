<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { settingsStorage, updateSetting } from "@/utils/storage";
  import type { ExtensionSettings, FeatureGroup, FeatureMetadata } from "@/types";
  import { DEFAULT_SETTINGS } from "@/types";
  import { getUIFeatureGroups } from "@/features/core/registry";
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
        loadError = null;
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

  function getSettingValue(feature: FeatureMetadata): boolean {
    const { section, key } = feature.settingKey;
    const sectionSettings = settings[section];
    return (sectionSettings as Record<string, boolean>)[key as string] ?? false;
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
                checked={getSettingValue(feature)}
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

<style>
  /* Base Styles */
  :global(body) {
    margin: 0;
    padding: 0;
    font-family:
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
    background: #f5f5f5;
    color: #171717;
  }

  main {
    width: 320px;
    padding: 1rem;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e5e5;
  }

  .logo {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  /* Error Banner */
  .error-banner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.85rem;
  }

  /* Loading State */
  .loading-state {
    text-align: center;
    padding: 2rem;
    color: #737373;
  }

  /* Legend */
  .legend {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.75rem;
    color: #737373;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .legend .emoji {
    font-size: 0.9rem;
  }

  .legend .prefix {
    font-weight: 500;
  }

  /* Sections */
  section {
    margin-bottom: 1rem;
  }

  section:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #737373;
  }

  /* Toggle Rows */
  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: white;
    border-radius: 8px;
    margin-bottom: 0.375rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .toggle-row.disabled {
    opacity: 0.5;
    background: #f5f5f5;
  }

  .toggle-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .toggle-label .emoji {
    font-size: 1rem;
  }

  .toggle-label .prefix {
    font-weight: 500;
    color: #525252;
  }

  .tooltip-icon {
    cursor: help;
    font-size: 0.8rem;
  }

  /* Toggle Switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 22px;
    flex-shrink: 0;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #d4d4d4;
    transition: 0.2s;
    border-radius: 22px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  input:checked + .slider {
    background-color: #3b49df;
  }

  input:checked + .slider:before {
    transform: translateX(18px);
  }

  input:disabled + .slider {
    cursor: not-allowed;
    background-color: #e5e5e5;
  }
</style>
