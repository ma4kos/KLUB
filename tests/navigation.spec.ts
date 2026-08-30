import { test, expect } from '@playwright/test';
import { skipUnlessDesktop, skipUnlessMobile } from './helpers';
import studio from '../src/content/studio.json' with { type: 'json' };

/**
 * Header, footer and mobile-menu navigation.
 *
 * Header markup (from dist/index.html):
 *   <nav class="desktop-nav" aria-label="Primary"> Classes | Schedule |
 *     Memberships | About | Location </nav>  (Alex's Option-1 nav — Schedule
 *     is the live bsport calendar on /book/, Memberships is /pricing/)
 *   <a class="btn btn--primary btn--sm book-cta" data-cta="header-book"
 *      href="{studio.bookingUrl || '/book/'}">
 *   <button id="nav-toggle" aria-controls="mobile-nav" aria-expanded="false">
 *   <nav class="mobile-nav" id="mobile-nav" hidden> ...same links + About,
 *     Contact, and a Book button (data-cta="mobile-nav-book") </nav>
 *
 * The Book buttons follow bookLink() in src/site.ts: the studio's live booking
 * system when studio.json `bookingUrl` is set, otherwise the /book/ page. It is
 * currently set to an EXTERNAL host, so these tests assert the href attribute
 * and never click it — a real click would navigate CI off-site.
 *
 * The desktop nav and book-cta are display:none at/below 900px and the
 * hamburger is display:none above it, so the two describe blocks gate on the
 * project's viewport WIDTH (see helpers.ts) — never on a project name.
 */

const expectedBook = studio.bookingUrl || '/book/';

test.describe('desktop header navigation', () => {
  test.beforeEach(() => skipUnlessDesktop());

  const navLinks = [
    { name: 'Classes', path: '/classes/' },
    { name: 'Schedule', path: '/book/' },
    { name: 'Memberships', path: '/pricing/' },
    { name: 'About', path: '/about/' },
    { name: 'Location', path: '/location/' },
  ];

  for (const link of navLinks) {
    test(`header "${link.name}" navigates to ${link.path}`, async ({ page }) => {
      await page.goto('/');
      const primary = page.getByRole('navigation', { name: 'Primary' });
      await primary.getByRole('link', { name: link.name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${link.path.replace(/\//g, '\\/')}$`));
    });
  }

  test('header Book CTA points at the booking destination from the CMS', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('a.book-cta');
    await expect(cta).toHaveCount(1);
    await expect(cta).toHaveAttribute('href', expectedBook);
  });
});

test.describe('footer links', () => {
  test('every internal footer link resolves (HTTP ok)', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer.site-footer');
    await expect(footer).toBeVisible();

    // Unique internal (root-relative) hrefs in the footer.
    const hrefs = await footer.locator('a[href^="/"]').evaluateAll((els) =>
      Array.from(
        new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute('href') ?? ''))
      ).filter(Boolean)
    );
    expect(hrefs.length, 'no internal footer links found').toBeGreaterThan(0);

    for (const href of hrefs) {
      const res = await page.request.get(href);
      expect(res.ok(), `footer link ${href} returned ${res.status()}`).toBeTruthy();
    }
  });
});

test.describe('mobile menu', () => {
  test.beforeEach(() => skipUnlessMobile());

  test('hamburger opens the mobile nav and its links navigate', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#nav-toggle');
    const mobileNav = page.locator('#mobile-nav');

    // Closed to start.
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileNav).toBeHidden();

    // Open it.
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(mobileNav).toBeVisible();

    // A link inside the opened menu works.
    await mobileNav.getByRole('link', { name: 'Memberships', exact: true }).click();
    await expect(page).toHaveURL(/\/pricing\/$/);
  });

  test('mobile menu Book button points at the booking destination from the CMS', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('[data-cta="mobile-nav-book"]');
    await expect(cta).toHaveCount(1);
    await expect(cta).toHaveAttribute('href', expectedBook);
  });
});
