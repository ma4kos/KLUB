import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the KLUB Pilates website end-to-end suite.
 *
 * Target: the LIVE temporary production URL https://klub-cy.netlify.app
 * (built from the `main` branch). No local dev server is required — every
 * spec runs against the deployed static site.
 *
 * NOTE on the domain: the real domain klub.cy is still being transferred and
 * is not live yet. The live netlify.app deploy currently emits a canonical /
 * og:url of https://klub-cy.com because the domain-fix pull request (#2) is
 * intentionally held. The intended canonical is https://klub.cy (already in
 * dist/ and src/). seo.spec.ts therefore accepts EITHER host.
 */
export default defineConfig({
  testDir: './tests',
  // Every spec is read-only against a live site, so tests are independent.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  // Per-test ceiling and assertion ceiling — generous for a remote site.
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'https://klub-cy.netlify.app',
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
