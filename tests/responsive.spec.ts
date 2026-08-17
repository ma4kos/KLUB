import { test, expect } from '@playwright/test';

/**
 * Mobile layout checks. These run on the mobile-safari (iPhone 13, 390px)
 * project only. At <=900px the CSS media query hides the desktop nav and the
 * header book-cta and shows the hamburger.
 */

test.describe('responsive (mobile)', () => {
  test.beforeEach(() => {
    test.skip(
      test.info().project.name !== 'mobile-safari',
      'mobile-only layout checks'
    );
  });

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
