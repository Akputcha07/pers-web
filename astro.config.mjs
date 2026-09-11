// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // EDIT ME: your production domain. Powers canonical URLs, sitemap.xml and rss.xml.
  // Elsewhere in the code this is read back as `import.meta.env.SITE`.
  site: 'https://yourdomain.com',

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-default' },
      wrap: true,
    },
  },
});
