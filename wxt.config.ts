import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    manifest_version: 3,
    permissions: ['storage'],
    host_permissions: ['https://dev.to/*'],
  },
});
