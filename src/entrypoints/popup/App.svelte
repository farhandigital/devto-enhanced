<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { settingsStorage, updateSetting } from '@/utils/storage';
  import type { ExtensionSettings } from '@/utils/types';
  import { DEFAULT_SETTINGS } from '@/utils/types';

  let settings: ExtensionSettings = DEFAULT_SETTINGS;
  let unwatch: (() => void) | undefined;

  type ToggleItem<K extends keyof ExtensionSettings> = {
    key: keyof ExtensionSettings[K];
    label: string;
  };

  type ToggleSection<K extends keyof ExtensionSettings> = {
    section: K;
    title: string;
    items: ToggleItem<K>[];
  };

  const toggleConfig: (ToggleSection<'article'> | ToggleSection<'home'>)[] = [
    {
      section: 'article' as const,
      title: 'Article Page',
      items: [
        { key: 'hideLeftSidebar', label: 'Hide Left Sidebar' },
        { key: 'hideRightSidebar', label: 'Hide Right Sidebar' },
        { key: 'moveEngagement', label: 'Move Engagement Buttons' },
        { key: 'showToC', label: 'Sticky Table of Contents' },
        { key: 'showReadingStats', label: 'Reading Stats' },
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
  ] as const;

  onMount(async () => {
    try {
      settings = await settingsStorage.getValue();
    } catch (error) {
      console.error('Failed to load settings from storage:', error);
      settings = DEFAULT_SETTINGS;
    }
    
    // Watch for external changes
    unwatch = settingsStorage.watch((newVal) => {
      if (newVal) settings = newVal;
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

  function handleToggle<K extends keyof ExtensionSettings>(
    section: K,
    key: keyof ExtensionSettings[K],
    e: Event
  ) {
    const target = e.target as HTMLInputElement;
    updateSetting(section, key, target.checked);
  }

  function getSettingValue<K extends keyof ExtensionSettings>(
    section: K,
    key: keyof ExtensionSettings[K]
  ): boolean {
    return settings[section][key] as boolean;
  }
</script>

<main>
  <h2>Dev.to Enhancer</h2>

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
              on:change={(e) => handleToggle(section, itemKey, e)}
              aria-labelledby="{section}-{item.key}-label"
              aria-checked={getSettingValue(section, itemKey)}
            >
            <span class="slider" aria-hidden="true"></span>
          </label>
        </div>
      {/each}
    </section>
  {/each}
</main>