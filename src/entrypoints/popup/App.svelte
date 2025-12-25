<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { settingsStorage, updateSetting } from '@/utils/storage';
  import type { ExtensionSettings } from '@/utils/types';
  import { DEFAULT_SETTINGS } from '@/utils/types';

  let settings: ExtensionSettings = DEFAULT_SETTINGS;
  let unwatch: (() => void) | undefined;

  type ToggleItem = {
    key: string;
    label: string;
  };

  type ToggleSection = {
    section: keyof ExtensionSettings;
    title: string;
    items: ToggleItem[];
  };

  const toggleConfig: ToggleSection[] = [
    {
      section: 'article',
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
      section: 'home',
      title: 'Homepage',
      items: [
        { key: 'hideLeftSidebar', label: 'Hide Left Sidebar' },
        { key: 'hideRightSidebar', label: 'Hide Right Sidebar' },
      ],
    },
  ];

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
</script>

<main>
  <h2>Dev.to Enhancer</h2>

  {#each toggleConfig as { section, title, items }}
    <section>
      <h3>{title}</h3>
      {#each items as item}
        <div class="toggle-row">
          <span class="toggle-label" id="{section}-{item.key}-label">{item.label}</span>
          <label class="switch" for="{section}-{item.key}">
            <input 
              type="checkbox" 
              id="{section}-{item.key}"
              checked={settings[section][item.key]} 
              on:change={(e) => handleToggle(section, item.key, e)}
              aria-labelledby="{section}-{item.key}-label"
              aria-checked={settings[section][item.key]}
            >
            <span class="slider" aria-hidden="true"></span>
          </label>
        </div>
      {/each}
    </section>
  {/each}
</main>