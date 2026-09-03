import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The site's public origin. Declared ONCE, here.
//
// `src/site.ts` derives SITE.url from this via `import.meta.env.SITE`, so the
// canonical link, og:url, JSON-LD and the sitemap can no longer drift apart —
// the split that produced the klub.cy / klub-cy.com incident.
//
// Override it for a test deployment (for example onto Wix-managed hosting) so
// the test build never publishes a sitemap or canonical links claiming the
// live production addresses, which would risk the live site's search ranking:
//
//   PUBLIC_SITE_URL=https://example.wixsite.com npm run build
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.keeplivingunderbalance.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  compressHTML: true,
});
