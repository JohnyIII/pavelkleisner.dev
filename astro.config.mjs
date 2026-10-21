// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://pavelkleisner.dev',
  integrations: [
    sitemap({
      // /ai/ a /cz/ai/ jsou jen sdílitelné odkazy na sekci, ne samostatné stránky
      filter: (page) => !/\/ai\/$/.test(page),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          cz: 'cs-CZ',
        },
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    plugins: [tailwindcss()]
  }
});
