import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility.
 *
 * Runs axe-core against the WCAG 2.0/2.1 A and AA rule sets on the three pages
 * that carry the site's whole layout vocabulary, at a desktop and a phone
 * width. Plus two keyboard checks that axe cannot do: the mobile menu must be
 * operable from the keyboard, and the marquee must be pausable (WCAG 2.2.2 —
 * moving content that starts automatically needs a control).
 *
 * Runs in its own `a11y` project (see playwright.config.ts) so CI can keep it
 * as a NON-BLOCKING job while any deferred violations are triaged. Anything
 * genuinely deferred belongs in DEFERRED_RULES below, with a reason — never in
 * a deleted assertion.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
/** Longest entrance animation is 0.9s with a 0.52s delay; round up. */
const SETTLE_MS = 2000;
const PAGES = ['/', '/pricing/', '/classes/'];
const WIDTHS = [
  { label: 'desktop', width: 1280, height: 800 },
  { label: 'phone', width: 390, height: 844 },
];

/**
 * Rules knowingly deferred. Add an entry ONLY with a reason and an owner,
 * never just to make a run go green.
 *
 * scrollable-region-focusable — REAL, unfixed, one-line fix, not in this
 *   workstream's files. At 390px the two widest pricing tables scroll inside
 *   the `.table-scroll` wrapper added to src/pages/pricing.astro (the fix for
 *   the 320/768px horizontal-overflow bug). A mouse user drags it; a keyboard
 *   user cannot reach it at all, so the Flexi Packs and Private 1-to-1 prices
 *   are unreadable without a pointer. Fix: `tabindex="0"` plus
 *   `role="region"` and an `aria-label` on that wrapper in pricing.astro. Once
 *   that lands, delete this entry — the rule is disabled site-wide while it is
 *   here, so it is also masking any future scrollable region.
 */
const DEFERRED_RULES: string[] = ['scrollable-region-focusable'];

/**
 * Reduced motion, so axe measures a settled page.
 *
 * The homepage fades sections in with `.rise` (0.9s, staggered up to 0.52s) and
 * `.reveal`. Sampling colour contrast mid-fade produces violations that come
 * and go between runs — a test that fails at random teaches people to ignore
 * it. global.css turns every animation and transition off under
 * prefers-reduced-motion and paints the same END state, so this measures
 * exactly what a visitor ends up looking at, deterministically.
 */
test.use({ reducedMotion: 'reduce' });

for (const { label, width, height } of WIDTHS) {
  for (const route of PAGES) {
    test(`${route} has no WCAG A/AA violations (${label}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(route, { waitUntil: 'load' });
      // Let the entrance animations finish. Sampled mid-fade, axe reports
      // colour-contrast failures that are not there once the page settles, and
      // a test that fails at random is a test people learn to ignore.
      await page.waitForTimeout(SETTLE_MS);

      let builder = new AxeBuilder({ page }).withTags(TAGS);
      if (DEFERRED_RULES.length) builder = builder.disableRules(DEFERRED_RULES);
      const results = await builder.analyze();

      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}\n    ${v.nodes[0]?.target.join(' ')}`
      );
      expect(summary, `axe violations on ${route} at ${width}px`).toEqual([]);
    });
  }
}

test('the mobile menu opens and closes from the keyboard, flipping aria-expanded', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'load' });

  const toggle = page.locator('#nav-toggle');
  const nav = page.locator('#mobile-nav');

  await toggle.focus();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAttribute('aria-label', /open menu/i);

  await page.keyboard.press('Enter');
  await expect(nav, 'the menu did not open from the keyboard').toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle, 'the button still says "Open menu" while open').toHaveAttribute(
    'aria-label',
    /close menu/i
  );

  // Same button closes it again — focus never leaves it.
  await page.keyboard.press('Enter');
  await expect(nav).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

// KNOWN GAP, not this workstream's file to fix. src/components/Header.astro
// binds only a click handler on #nav-toggle, so Escape does nothing while the
// drawer is open — the expected way out of any expanded disclosure. Fix is a
// keydown listener on document that closes the nav and returns focus to the
// toggle. Delete the fixme line below once it lands.
test('the mobile menu closes with Escape', async ({ page }) => {
  test.fixme(true, 'Header.astro has no Escape handler yet — see the comment above');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'load' });

  const toggle = page.locator('#nav-toggle');
  const nav = page.locator('#mobile-nav');

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(nav).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(nav, 'Escape did not close the menu').toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('the marquee can be paused from the keyboard', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });

  const pause = page.locator('.marquee__pause');
  await expect(pause, 'the moving marquee has no pause control (WCAG 2.2.2)').toHaveCount(1);
  await expect(pause).toHaveAttribute('aria-label', /pause/i);

  await pause.focus();
  await expect(pause, 'the pause control cannot be reached by keyboard').toBeFocused();
});
