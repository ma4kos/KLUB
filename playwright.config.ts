import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the KLUB Pilates website end-to-end suite.
 *
 * TARGET: by default the suite builds the site and runs it locally, so the
 * tests never depend on a deploy being reachable. This matters here — the
 * Netlify site has password protection enabled, so pointing the suite at the
 * deployed URL made every request return an HTTP 401 password page instead of
 * the site (which is what the previous configuration did).
 *
 * To smoke-test a real deploy, or to re-run against a preview you already have
 * running, set BASE_URL (see the `test:fast` script in package.json):
 *   BASE_URL=https://deploy-preview-12--klub-cy.netlify.app npx playwright test
 * (with site protection on, add the password via storage state or disable it
 * for the deploy you are testing).
 *
 * PROJECTS: `npm test` runs the whole matrix. Locally you can narrow it:
 *   npx playwright test --project=desktop-chrome
 *   npx playwright test --project=breakpoints
 * Only Chromium ships in some sandboxes; the firefox/webkit projects need
 * `npx playwright install firefox webkit` first (CI does this).
 *
 * SPECS MUST NEVER GATE THEMSELVES ON A PROJECT NAME. Project names are free
 * text and renaming one turned seven navigation tests into silent skips while
 * the suite still reported green. Layout-dependent specs gate on the viewport
 * WIDTH via tests/helpers.ts; specs that only need to run once are pinned to a
 * project here, in the config, where a rename cannot hide them.
 */

const EXTERNAL = process.env.BASE_URL;
const PORT = 4321;
const baseURL = EXTERNAL || `http://localhost:${PORT}`;

// The breakpoint sweep drives viewports itself, so it runs in exactly one
// project instead of once per device.
const SWEEP = /breakpoints\.spec\.ts/;

// Device-independent checks — a 404, a deleted CMS key, a drifted price or a
// missing analytics event is identical on every engine. One run each.
const CHECKS = /(analytics|assets|cms-config|content)\.spec\.ts/;

// Accessibility. Its own project so CI can run it as a NON-BLOCKING job while
// the outstanding axe violations are triaged.
const A11Y = /a11y\.spec\.ts/;

// What the per-device projects must not pick up.
const SINGLE_RUN = [SWEEP, CHECKS, A11Y];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Two retries in CI absorb genuinely flaky infrastructure; none locally, so a
  // failure is immediate and the trace below is the first thing you look at.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    // The target is a local static preview that answers in milliseconds, so a
    // 30-second wait only delays a failure that is already certain.
    navigationTimeout: 15_000,
    actionTimeout: 10_000,
    // retain-on-failure, not on-first-retry: retries are 0 locally, so
    // on-first-retry produced no trace exactly where a developer needs one.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // Build once, serve the real static output. Skipped when BASE_URL is set.
  webServer: EXTERNAL
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --port ' + PORT,
        url: `http://localhost:${PORT}/`,
        // Never reuse: `astro preview` does not fail when the port is taken, it
        // prints "Port 4321 is in use, trying another one..." and moves up. A
        // stale preview would then serve OLD HTML to a full green run. Use
        // `npm run test:fast` (BASE_URL) for the deliberate opt-out.
        reuseExistingServer: false,
        timeout: 180_000,
        stdout: 'ignore',
        stderr: 'pipe',
      },

  projects: [
    // --- Desktop: the three engines ---
    {
      name: 'desktop-chrome',
      testIgnore: SINGLE_RUN,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'desktop-firefox',
      testIgnore: SINGLE_RUN,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'desktop-safari',
      // 1440 sits above the 1100px header breakpoint; Safari is heavily used by
      // this audience (iPhone/Mac) and is the strictest about video autoplay.
      testIgnore: SINGLE_RUN,
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },

    // --- Phones: where most of a local studio's traffic lands ---
    {
      name: 'mobile-safari-small',
      // iPhone SE, 375px — the narrowest realistic device; below every breakpoint.
      testIgnore: SINGLE_RUN,
      use: { ...devices['iPhone SE'] },
    },
    {
      name: 'mobile-safari',
      testIgnore: SINGLE_RUN,
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'mobile-chrome',
      // Pixel 7, 412px — Android/Chromium rendering path.
      testIgnore: SINGLE_RUN,
      use: { ...devices['Pixel 7'] },
    },

    // --- Tablets: straddle the 720/780/820/860/900 cluster ---
    {
      name: 'tablet-portrait',
      // iPad Mini portrait, 768px — inside the "stacked" range.
      testIgnore: SINGLE_RUN,
      use: { ...devices['iPad Mini'] },
    },
    {
      name: 'tablet-landscape',
      // iPad Mini landscape, 1024px — between the 900 and 1100 breakpoints,
      // the width where the header swaps to the compact priced CTA.
      testIgnore: SINGLE_RUN,
      use: { ...devices['iPad Mini landscape'] },
    },

    // --- Layout sweep across every CSS breakpoint (Chromium only, fast) ---
    {
      name: 'breakpoints',
      testMatch: SWEEP,
      use: { ...devices['Desktop Chrome'] },
    },

    // --- Device-independent checks, once ---
    {
      name: 'checks',
      testMatch: CHECKS,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },

    // --- Accessibility, once, non-blocking in CI while triage finishes ---
    {
      name: 'a11y',
      testMatch: A11Y,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
});
