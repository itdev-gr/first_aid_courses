// web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.firstaid-academy.gr',
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
    sitemap({
      // Keep admin, API, and internal payment-flow pages out of the sitemap.
      // Search engines and AI crawlers should not surface these.
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/api/') &&
        !page.includes('/kratisi/mock-pay') &&
        !page.includes('/kratisi/paid') &&
        !page.includes('/kratisi/payment-failed') &&
        !page.includes('/kratisi/success'),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
