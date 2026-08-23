import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const configuredSite = process.env.SITE_URL?.trim();
const site = configuredSite && configuredSite !== 'https://example.com'
  ? configuredSite
  : 'https://michaeldinko.vercel.app';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
