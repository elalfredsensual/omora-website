// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Server-rendered site so visitors get fresh data after admin edits
// without a rebuild.
export default defineConfig({
  site: 'https://omora.alfredsensual.com',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  // We sit behind nginx (which rewrites Host), so Astro's built-in
  // Origin/Host comparison would always fail. CSRF is mitigated by the
  // SameSite=Lax session cookie and the admin password.
  security: {
    checkOrigin: false,
  },
});
