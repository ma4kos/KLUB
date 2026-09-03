import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Test deployment only. This must NOT point at the client's live domain
  // (https://www.keeplivingunderbalance.com) — a test build publishing a sitemap
  // that claims those addresses risks the live site's search ranking.
  // Replaced with the Wix-hosted URL once the headless project is released.
  site: 'https://klub-headless-test.wixsite.invalid',
  integrations: [sitemap()],
  compressHTML: true,
});
