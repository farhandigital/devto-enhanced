import { storage } from '#imports';
import { DEFAULT_SETTINGS, type ExtensionSettings } from '@/types/settings';

export const settingsStorage = storage.defineItem<ExtensionSettings>(
  'local:settings',
  {
    defaultValue: DEFAULT_SETTINGS,
  },
);

/**
 * Helper to update a specific nested setting
 */
export async function updateSetting<K extends keyof ExtensionSettings>(
  section: K,
  key: keyof ExtensionSettings[K],
  value: boolean
) {
  const current = await settingsStorage.getValue();
  await settingsStorage.setValue({
    ...current,
    [section]: {
      ...current[section],
      [key]: value,
    },
  });
}