<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { settingsStorage, updateSetting } from "@/utils/storage";
  import type { ExtensionSettings } from "@/types/settings";
  import type { FeatureMetadata } from "@/features/registry";
  import { DEFAULT_SETTINGS } from "@/types/settings";
  import { getUIFeaturesMetadata } from "@/features/registry";
  import iconUrl from "/icon.png";

  let settings = $state<ExtensionSettings>(DEFAULT_SETTINGS);
  let unwatch: (() => void) | undefined;
  let loadError = $state<string | null>(null);
  let isLoading = $state(true);

  type ToggleSection = {
    section: keyof ExtensionSettings;
    title: string;
    features: FeatureMetadata[];
  };

  // Lazy initialization - computed on first access
  let toggleConfig = $state<ToggleSection[]>([]);

  // Initialize toggle config lazily
  function initializeToggleConfig() {
    // Import feature metadata only (not the full implementations)
    // This is a dynamic import as a side-effect import to avoid module-level execution
    import("@/features/metadata")
      .then(() => {
        const uiFeatures = getUIFeaturesMetadata();
        toggleConfig = [
          {
            section: "global" as const,
            title: "Global",
            features: uiFeatures.global,
          },
          {
            section: "home" as const,
            title: "Homepage",
            features: uiFeatures.home,
          },
          {
            section: "article" as const,
            title: "Article Page",
            features: uiFeatures.article,
          },
        ].filter((section) => section.features.length > 0);
      })
      .catch((error) => {
        console.error("Failed to load feature metadata:", error);
      });
  }

  onMount(async () => {
    // Initialize toggle configuration
    initializeToggleConfig();

    try {
      settings = await settingsStorage.getValue();
      loadError = null; // Clear error on successful load
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
        loadError = null; // Clear error when settings successfully update
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
      // Revert the checkbox state on error
      target.checked = !target.checked;
    }
  }

  function getSettingValue(feature: FeatureMetadata): boolean {
    const { section, key } = feature.settingKey;
    const sectionSettings = settings[section];
    return (sectionSettings as Record<string, boolean>)[key] ?? false;
  }

  function getEmoji(featureType: "hide" | "add"): string {
    return featureType === "hide" ? "🧹" : "⚡";
  }

  function getPrefix(featureType: "hide" | "add"): string {
    return featureType === "hide" ? "Hide" : "Add";
  }

  function isFeatureEnabled(feature: FeatureMetadata): boolean {
    // Special case: centerArticle requires right sidebar hidden AND ToC disabled
    if (
      feature.settingKey.section === "article" &&
      feature.settingKey.key === "centerArticle"
    ) {
      return settings.article.hideRightSidebar && !settings.article.showToC;
    }
    return true; // All other features are always enabled
  }

  function getDisabledTooltip(feature: FeatureMetadata): string | null {
    if (
      feature.settingKey.section === "article" &&
      feature.settingKey.key === "centerArticle"
    ) {
      if (!settings.article.hideRightSidebar && settings.article.showToC) {
        return "Requires: Right Sidebar hidden AND ToC disabled";
      }
      if (!settings.article.hideRightSidebar) {
        return "Requires: Right Sidebar hidden";
      }
      if (settings.article.showToC) {
        return "Requires: ToC disabled";
      }
    }
    return null;
  }
</script>

<main>
  <div class="header">
    <img src={iconUrl} alt="Dev.to Enhancer" class="logo" />
    <h2>Dev.to Enhancer</h2>
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

    {#each toggleConfig as { section, title, features } (section)}
      <section>
        <h3>{title}</h3>
        {#each features as feature (feature.name)}
          {@const enabled = isFeatureEnabled(feature)}
          {@const tooltip = getDisabledTooltip(feature)}
          <div class="toggle-row" class:disabled={!enabled}>
            <span
              class="toggle-label"
              id="{section}-{feature.settingKey.key}-label"
            >
              <span class="emoji">{getEmoji(feature.type)}</span>
              <span class="prefix">{getPrefix(feature.type)}</span>
              {feature.label}
              {#if tooltip}
                <span class="tooltip-icon" title={tooltip}>ℹ️</span>
              {/if}
            </span>
            <label class="switch" for="{section}-{feature.settingKey.key}">
              <input
                type="checkbox"
                id="{section}-{feature.settingKey.key}"
                checked={getSettingValue(feature)}
                onchange={(e) => handleToggle(feature, e)}
                aria-labelledby="{section}-{feature.settingKey.key}-label"
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
