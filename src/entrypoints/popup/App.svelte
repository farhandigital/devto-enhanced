<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { settingsStorage, updateSetting } from '@/utils/storage';
  import type { ExtensionSettings } from '@/utils/types';
  import { DEFAULT_SETTINGS } from '@/utils/types';
  import iconUrl from '/icon.png';

  let settings = $state<ExtensionSettings>(DEFAULT_SETTINGS);
  let unwatch: (() => void) | undefined;
  let loadError = $state<string | null>(null);
  let isLoading = $state(true);

  type ToggleItem<K extends keyof ExtensionSettings> = {
    key: keyof ExtensionSettings[K];
    label: string;
  };

  type ToggleSection<K extends keyof ExtensionSettings> = {
    section: K;
    title: string;
    items: ToggleItem<K>[];
  };

  const toggleConfig: (ToggleSection<'global'> | ToggleSection<'article'> | ToggleSection<'home'>)[] = [
    {
      section: 'global' as const,
      title: 'Global',
      items: [
        { key: 'hideSubforemSwitcher', label: 'Hide Subforem Switcher' },
      ],
    },
    {
      section: 'home' as const,
      title: 'Homepage',
      items: [
        { key: 'hideLeftSidebar', label: 'Hide Left Sidebar' },
        { key: 'hideRightSidebar', label: 'Hide Right Sidebar' },
      ],
    },
    {
      section: 'article' as const,
      title: 'Article Page',
      items: [
        { key: 'hideRightSidebar', label: 'Hide Right Sidebar' },
        { key: 'moveEngagement', label: 'Move Engagement Buttons' },
        { key: 'showToC', label: 'Sticky Table of Contents' },
        { key: 'showReadingStats', label: 'Reading Stats' },
        { key: 'showCopyButton', label: 'Copy Article Button' },
      ],
    },
  ];

  onMount(async () => {
    try {
      settings = await settingsStorage.getValue();
      loadError = null; // Clear error on successful load
    } catch (error) {
      console.error('Failed to load settings from storage:', error);
      loadError = 'Failed to load settings. Using default values.';
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
        console.error('Failed to cleanup storage watcher:', error);
      }
    }
  });

  async function handleToggle<K extends keyof ExtensionSettings>(
    section: K,
    key: keyof ExtensionSettings[K],
    e: Event
  ) {
    const target = e.target as HTMLInputElement;
    try {
      await updateSetting(section, key, target.checked);
    } catch (error) {
      console.error('Failed to update setting:', error);
      // Revert the checkbox state on error
      target.checked = !target.checked;
    }
  }

  function getSettingValue<K extends keyof ExtensionSettings>(
    section: K,
    key: keyof ExtensionSettings[K]
  ): boolean {
    return settings[section][key] as boolean;
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
    {#each toggleConfig as { section, title, items }}
      <section>
        <h3>{title}</h3>
        {#each items as item}
          {@const itemKey = item.key as keyof ExtensionSettings[typeof section]}
          <div class="toggle-row">
            <span class="toggle-label" id="{section}-{item.key}-label">{item.label}</span>
            <label class="switch" for="{section}-{item.key}">
              <input 
                type="checkbox" 
                id="{section}-{item.key}"
                checked={getSettingValue(section, itemKey)} 
                onchange={(e) => handleToggle(section, itemKey, e)}
                aria-labelledby="{section}-{item.key}-label"
              >
              <span class="slider" aria-hidden="true"></span>
            </label>
          </div>
        {/each}
      </section>
    {/each}
  {/if}
</main>