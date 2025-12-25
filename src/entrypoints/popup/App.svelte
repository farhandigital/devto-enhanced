<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { settingsStorage, updateSetting } from '@/utils/storage';
  import type { ExtensionSettings } from '@/utils/types';
  import { DEFAULT_SETTINGS } from '@/utils/types';

  let settings: ExtensionSettings = DEFAULT_SETTINGS;
  let unwatch: (() => void) | undefined;

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

  <section>
    <h3>Article Page</h3>
    <div class="toggle-row">
      <span class="toggle-label">Hide Left Sidebar</span>
      <label class="switch">
        <input type="checkbox" checked={settings.article.hideLeftSidebar} on:change={(e) => handleToggle('article', 'hideLeftSidebar', e)}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Hide Right Sidebar</span>
      <label class="switch">
        <input type="checkbox" checked={settings.article.hideRightSidebar} on:change={(e) => handleToggle('article', 'hideRightSidebar', e)}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Move Engagement Buttons</span>
      <label class="switch">
        <input type="checkbox" checked={settings.article.moveEngagement} on:change={(e) => handleToggle('article', 'moveEngagement', e)}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Sticky Table of Contents</span>
      <label class="switch">
        <input type="checkbox" checked={settings.article.showToC} on:change={(e) => handleToggle('article', 'showToC', e)}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Reading Stats</span>
      <label class="switch">
        <input type="checkbox" checked={settings.article.showReadingStats} on:change={(e) => handleToggle('article', 'showReadingStats', e)}>
        <span class="slider"></span>
      </label>
    </div>
  </section>

  <section>
    <h3>Homepage</h3>
    <div class="toggle-row">
      <span class="toggle-label">Hide Left Sidebar</span>
      <label class="switch">
        <input type="checkbox" checked={settings.home.hideLeftSidebar} on:change={(e) => handleToggle('home', 'hideLeftSidebar', e)}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Hide Right Sidebar</span>
      <label class="switch">
        <input type="checkbox" checked={settings.home.hideRightSidebar} on:change={(e) => handleToggle('home', 'hideRightSidebar', e)}>
        <span class="slider"></span>
      </label>
    </div>
  </section>
</main>