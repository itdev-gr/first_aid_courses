// web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://firstaidacademy.gr',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false },
    imageService: true,
  }),
  security: {
    // Astro's default CSRF check rejects same-origin DELETE/PUT when the Origin header
    // doesn't survive Vercel's edge rewrite. Auth is enforced via httpOnly session cookies
    // + the /admin middleware, so disabling the origin check is safe here.
    checkOrigin: false,
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
  ],
  build: { inlineStylesheets: 'auto' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
