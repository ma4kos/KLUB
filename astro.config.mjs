import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import wix from '@wix/astro';
import wixHostingAdapter from '@wix/astro-wix-hosting-adapter';

// TWO BUILD MODES.
//
// Default (`npm run build`) is the static Astro site the Playwright suite and
// CI have always tested: no adapter, no server runtime, output to dist/ as
// plain HTML. Nothing about testing changed when this repo gained Wix.
//
// Wix mode (`npm run wix:build`, which sets WIX_BUILD=true) adds Wix's Astro
// integration and hosting adapter and switches to server rendering, which is
// what Wix-managed hosting runs. Only the deploy path uses it.
//
// Keeping them separate matters: `wix preview` and `wix release` UPLOAD to
// Wix. The test suite runs `npm run build && npm run preview`, so if those
// names pointed at the Wix toolchain — as they did immediately after
// `headless link` — every CI run would attempt a deployment.
const WIX_BUILD = process.env.WIX_BUILD === 'true';

// The site's public origin. Declared ONCE, here.
//
// `src/site.ts` derives SITE.url from this via `import.meta.env.SITE`, so the
// canonical link, og:url, JSON-LD and the sitemap can no longer drift apart —
// the split that produced the klub.cy / klub-cy.com incident.
//
// Override it for a test deployment so the build never publishes a sitemap or
// canonical links claiming the live production addresses:
//
//   PUBLIC_SITE_URL=https://example.wix-site-host.com npm run wix:build
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.keeplivingunderbalance.com';

export default defineConfig({
  site: SITE_URL,
  integrations: WIX_BUILD ? [sitemap(), react(), wix()] : [sitemap()],
  compressHTML: true,
  ...(WIX_BUILD
    ? {
        adapter: wixHostingAdapter(),
        output: 'server',
        image: { domains: ['static.wixstatic.com'] },
      }
    : {}),
});
