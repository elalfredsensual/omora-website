// @ts-check
import { defineConfig } from 'astro/config';

// Used for canonical URLs and social-share (Open Graph) tags.
export default defineConfig({
  site: 'https://omora.alfredsensual.com',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
