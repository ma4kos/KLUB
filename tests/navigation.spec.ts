import { test, expect } from '@playwright/test';

/**
 * Header, footer and mobile-menu navigation.
 *
 * Header markup (from dist/index.html):
 *   <nav class="desktop-nav" aria-label="Primary"> Classes | Pricing |
 *     Timetable | Instructors | FAQ | Location </nav>
 *   <a class="book-cta" href="/book/">Book Now</a>
 *   <button id="nav-toggle" aria-controls="mobile-nav" aria-expanded="false">
 *   <nav class="mobile-nav" id="mobile-nav" hidden> ...same links + About,
 *     Contact, Book Now </nav>
 *
 * The desktop nav and book-cta are display:none below 900px (CSS media query),
 * so those checks run on the desktop-chromium project only. The hamburger is
 * display:none above 900px, so its checks run on mobile-safari only.
 */

test.describe('desktop header navigation', () => {
  test.beforeEach(() => {
    test.skip(
      test.info().project.name !== 'desktop-chromium',
      'desktop nav is hidden below 900px'
    );
  });

  const navLinks = [
    { name: 'Classes', path: '/classes/' },
    { name: 'Pricing', path: '/pricing/' },
    { name: 'Timetable', path: '/timetable/' },
    { name: 'Instructors', path: '/instructors/' },
    { name: 'FAQ', path: '/faq/' },
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

  test('header "Book Now" CTA navigates to /book/', async ({ page }) => {
    await page.goto('/');
    await page.locator('a.book-cta').click();
    await expect(page).toHaveURL(/\/book\/$/);
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
  test.beforeEach(() => {
    test.skip(
      test.info().project.name !== 'mobile-safari',
      'hamburger only shows below 900px'
    );
  });

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
    await mobileNav.getByRole('link', { name: 'Pricing', exact: true }).click();
    await expect(page).toHaveURL(/\/pricing\/$/);
  });
});
