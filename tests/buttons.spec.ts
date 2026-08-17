import { test, expect } from '@playwright/test';

/**
 * Call-to-action / Book button integrity.
 *
 * From the built HTML, every button rendered as an anchor uses class "btn"
 * (variants btn--primary / btn--ghost / btn--accent). Every "Book" button
 * ("Book Now", "Book this class", "Book Your First Class — €20") points to
 * /book/ while the site's bookingUrl is empty. Submit buttons are <button>
 * elements, not anchors, so they are intentionally excluded here — anchors
 * are the only elements that must carry an href.
 *
 * These are attribute checks (read from the DOM), so hidden buttons — e.g. the
 * header book-cta on mobile — are still validated.
 */

// Representative pages that carry primary CTAs and Book buttons.
const PAGES = [
  '/',
  '/pricing/',
  '/classes/',
  '/classes/reformer-fundamentals/',
  '/book/',
  '/timetable/',
  '/instructors/',
];

function isInvalidHref(href: string | null): boolean {
  if (href === null) return true;
  const h = href.trim();
  if (h === '' || h === '#') return true;
  return h.toLowerCase().startsWith('javascript:');
}

for (const path of PAGES) {
  test(`every .btn anchor on ${path} has a valid non-empty href`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    const anchors = await page.locator('a.btn').evaluateAll((els) =>
      els.map((e) => ({
        href: (e as HTMLAnchorElement).getAttribute('href'),
        text: (e.textContent ?? '').trim(),
      }))
    );

    expect(anchors.length, `no .btn anchors found on ${path}`).toBeGreaterThan(0);
    for (const a of anchors) {
      expect(
        isInvalidHref(a.href),
        `button "${a.text}" has invalid href "${a.href}" on ${path}`
      ).toBeFalsy();
    }
  });

  test(`every Book button on ${path} points to /book/`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    // Anchors whose visible text contains the word "Book" (case-insensitive).
    // Word boundaries matter: this matches "Book", "Book Now", "Book this
    // class" but NOT "Facebook" (the footer social link).
    const BOOK_WORD = /\bbook\b/i;
    const bookAnchors = await page.locator('a', { hasText: BOOK_WORD }).evaluateAll((els) =>
      els
        .filter((e) => /\bbook\b/i.test(e.textContent ?? ''))
        .map((e) => ({
          href: (e as HTMLAnchorElement).getAttribute('href'),
          text: (e.textContent ?? '').trim(),
        }))
    );

    expect(bookAnchors.length, `no Book buttons found on ${path}`).toBeGreaterThan(0);
    for (const a of bookAnchors) {
      expect(a.href, `Book button "${a.text}" has no href on ${path}`).toBeTruthy();
      // bookingUrl is currently empty, so Book routes to the /book/ page.
      // Strip any origin in case an absolute URL is ever emitted.
      const pathPart = (a.href ?? '').replace(/^https?:\/\/[^/]+/, '');
      expect(pathPart, `Book button "${a.text}" -> "${a.href}" on ${path}`).toMatch(
        /\/book\/$/
      );
    }
  });
}
