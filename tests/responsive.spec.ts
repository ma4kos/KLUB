import { test, expect } from '@playwright/test';
import { NAV_BREAKPOINT, skipUnlessMobile } from './helpers';

/**
 * Mobile layout checks. These run in every project whose viewport is at or
 * below the 900px header breakpoint (iPhone SE, iPhone 13, Pixel 7, iPad Mini
 * portrait) — gated on the width, not on a project name, so renaming or adding
 * a device can never silently switch them off.
 */

test.describe(`responsive (<= ${NAV_BREAKPOINT}px)`, () => {
  test.beforeEach(() => skipUnlessMobile());

  test('nav collapses to a hamburger menu', async ({ page }) => {
    await page.goto('/');
    // Hamburger is shown; desktop nav and the mobile drawer are hidden.
    await expect(page.locator('#nav-toggle')).toBeVisible();
    await expect(page.locator('nav.desktop-nav')).toBeHidden();
    await expect(page.locator('#mobile-nav')).toBeHidden();
  });

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    const { scrollWidth, viewportWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(
      scrollWidth,
      `document scrollWidth ${scrollWidth} exceeds viewport ${viewportWidth}`
    ).toBeLessThanOrEqual(viewportWidth);
  });

  test('hero renders', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section.hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toBeVisible();
  });
});
