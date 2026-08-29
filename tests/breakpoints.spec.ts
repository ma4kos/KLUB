import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * Layout sweep across every CSS breakpoint the site actually declares.
 *
 * The stylesheets use @media widths 500, 520, 600, 720, 780, 820, 860, 900 and
 * 1100px, plus a `min-width: 861px` gate on the hero film. A device list alone
 * never lands on both sides of each of those, so this spec drives the viewport
 * directly and checks the invariants that must hold at every width.
 *
 * Runs in the single `breakpoints` project (see playwright.config.ts) rather
 * than once per device.
 */

// One width either side of every declared breakpoint, plus real device widths.
const WIDTHS = [
  320, 360, 375, 390, 412, 430, // phones
  499, 500, 501, 519, 520, 521, // the 500/520 pair
  599, 600, 601, // the busiest breakpoint
  719, 720, 721, 779, 780, 781, // tablet-ish
  819, 820, 821, 859, 860, 861, // the split/hero-video cluster
  899, 900, 901, // header nav swap
  1024, 1099, 1100, 1101, // compact vs full header CTA
  1280, 1440, 1920, // desktop
];

const HEADER_NAV_BREAKPOINT = 900; // desktop nav hidden at/below this
const HEADER_CTA_BREAKPOINT = 1100; // compact priced label at/below this
const STICKY_CTA_BREAKPOINT = 900; // mobile sticky bar shown at/below this

test.describe('breakpoint sweep', () => {
  for (const width of WIDTHS) {
    test(`homepage layout holds at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/', { waitUntil: 'load' });

      // 1. No horizontal overflow — the single most common responsive defect.
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        scrollWidth,
        `document scrollWidth ${scrollWidth} exceeds viewport ${clientWidth} at ${width}px`
      ).toBeLessThanOrEqual(clientWidth + 1); // +1 absorbs sub-pixel rounding

      // 2. Nothing visibly spills past the right edge. Elements inside a
      // clipping ancestor (the marquee ribbon, image frames, carousels) are
      // legitimately wider than the viewport and are cut off, not leaking.
      const spills = await page.evaluate((vw) => {
        const clipped = (el: HTMLElement) => {
          let n: HTMLElement | null = el.parentElement;
          while (n && n !== document.documentElement) {
            const ox = getComputedStyle(n).overflowX;
            if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return true;
            n = n.parentElement;
          }
          return false;
        };
        const out: string[] = [];
        document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (getComputedStyle(el).position === 'fixed') return;
          if (clipped(el)) return;
          if (r.right > vw + 2) {
            out.push(`${el.tagName.toLowerCase()}.${el.className || '(no class)'} right=${Math.round(r.right)}`);
          }
        });
        return out.slice(0, 5);
      }, width);
      expect(spills, `elements overflow the viewport at ${width}px`).toEqual([]);

      // 3. Header shows exactly one navigation affordance.
      const desktopNavVisible = await page.locator('nav.desktop-nav').isVisible();
      const hamburgerVisible = await page.locator('#nav-toggle').isVisible();
      if (width <= HEADER_NAV_BREAKPOINT) {
        expect(hamburgerVisible, `hamburger should show at ${width}px`).toBe(true);
        expect(desktopNavVisible, `desktop nav should be hidden at ${width}px`).toBe(false);
      } else {
        expect(desktopNavVisible, `desktop nav should show at ${width}px`).toBe(true);
        expect(hamburgerVisible, `hamburger should be hidden at ${width}px`).toBe(false);
      }

      // 4. The header booking button always exists and always carries a price.
      const headerCta = page.locator('a[data-cta="header-book"]');
      await expect(headerCta).toHaveCount(1);
      const full = page.locator('a[data-cta="header-book"] .cta-full');
      const short = page.locator('a[data-cta="header-book"] .cta-short');
      if (width > HEADER_NAV_BREAKPOINT) {
        const shown = width <= HEADER_CTA_BREAKPOINT ? short : full;
        const hidden = width <= HEADER_CTA_BREAKPOINT ? full : short;
        await expect(shown, `wrong header CTA label variant at ${width}px`).toBeVisible();
        await expect(hidden).toBeHidden();
        expect(
          (await shown.innerText()).includes('€'),
          `header CTA lost its price at ${width}px`
        ).toBe(true);
      }
    });
  }

  test('mobile sticky booking bar appears only below the desktop breakpoint', async ({ page }) => {
    for (const width of [390, 720, 899, 901, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/', { waitUntil: 'load' });
      await page.evaluate(() => window.scrollTo(0, 1200));
      await page.waitForTimeout(400);

      const bar = page.locator('#sticky-cta');
      const displayed = await bar.evaluate((el) => getComputedStyle(el).display !== 'none');
      if (width <= STICKY_CTA_BREAKPOINT) {
        expect(displayed, `sticky bar should exist at ${width}px`).toBe(true);
        await expect(bar, `sticky bar should be revealed after scrolling at ${width}px`).toHaveClass(/show/);
        const href = await bar.locator('a').getAttribute('href');
        expect(href, 'sticky bar must link to booking').toBeTruthy();
      } else {
        expect(displayed, `sticky bar must not show at ${width}px`).toBe(false);
      }
    }
  });

  test('no route overflows horizontally at the three critical widths', async ({ page }) => {
    const failures: string[] = [];
    for (const width of [320, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ROUTES) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        const { sw, cw } = await page.evaluate(() => ({
          sw: document.documentElement.scrollWidth,
          cw: document.documentElement.clientWidth,
        }));
        if (sw > cw + 1) failures.push(`${route} @ ${width}px (${sw} > ${cw})`);
      }
    }
    expect(failures, 'routes overflow horizontally').toEqual([]);
  });
});
