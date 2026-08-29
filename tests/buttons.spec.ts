import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import studio from '../src/content/studio.json' with { type: 'json' };

/**
 * Call-to-action / Book button integrity.
 *
 * Every button rendered as an anchor uses class "btn" (variants btn--primary /
 * btn--ghost / btn--accent). Every Book button follows bookLink() in
 * src/site.ts, which returns `studio.json` → `bookingUrl` when that is set and
 * falls back to the /book/ information page when it is empty.
 *
 * WHY THE ASSERTION IS EXACT: the previous version accepted "the live booking
 * host OR /book/", so both branches passed and the test could not see the CMS
 * field being cleared — which would quietly send every Book button on the site
 * to an information page instead of the booking system. The expected href is
 * therefore computed from studio.json and compared exactly.
 *
 * These are attribute checks read from the DOM, so hidden buttons — the header
 * book-cta on a phone, the mobile drawer on a desktop — are still validated,
 * and nothing is ever clicked (a click would navigate off-site).
 */

const EXPECTED_BOOK = studio.bookingUrl || '/book/';
const PAGES = [...ROUTES, '/404.html'];
const BOOK_WORD = /\bbook\b/i; // matches "Book Now", not "Facebook"

function isInvalidHref(href: string | null): boolean {
  if (href === null) return true;
  const h = href.trim();
  if (h === '' || h === '#') return true;
  return h.toLowerCase().startsWith('javascript:');
}

type Anchor = { href: string | null; text: string; cta: string | null };

async function anchors(page: import('@playwright/test').Page, selector: string): Promise<Anchor[]> {
  return page.locator(selector).evaluateAll((els) =>
    els.map((e) => ({
      href: (e as HTMLAnchorElement).getAttribute('href'),
      text: (e.textContent ?? '').replace(/\s+/g, ' ').trim(),
      cta: e.getAttribute('data-cta'),
    }))
  );
}

for (const path of PAGES) {
  test(`every .btn anchor on ${path} has a valid non-empty href`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const list = await anchors(page, 'a.btn');

    expect(list.length, `no .btn anchors found on ${path}`).toBeGreaterThan(0);
    for (const a of list) {
      expect(
        isInvalidHref(a.href),
        `button "${a.text}" has invalid href "${a.href}" on ${path}`
      ).toBeFalsy();
    }
  });

  test(`every Book button on ${path} points at ${EXPECTED_BOOK}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const list = (await anchors(page, 'a')).filter((a) => BOOK_WORD.test(a.text));

    expect(list.length, `no Book buttons found on ${path}`).toBeGreaterThan(0);

    // The footer's "Ways to book" link is the one deliberate exception: it
    // points at the /book/ information page, not the booking system.
    const isInfoLink = (a: Anchor) => /ways to book/i.test(a.text) && a.href === '/book/';

    for (const a of list) {
      if (isInfoLink(a)) continue;
      expect(
        a.href,
        `Book button "${a.text}" on ${path} points at "${a.href}" but studio.json says the booking destination is "${EXPECTED_BOOK}"`
      ).toBe(EXPECTED_BOOK);
    }
  });
}

test('the homepage carries each primary Book CTA exactly once, with the CMS label', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const label = studio.ctaLabel;
  const compact = studio.ctaCompact;

  for (const id of ['hero-book', 'intro-card-book', 'sticky-book', 'closing-book']) {
    const cta = page.locator(`[data-cta="${id}"]`);
    await expect(cta, `data-cta="${id}" should appear exactly once on the homepage`).toHaveCount(1);
    await expect(cta, `data-cta="${id}" should carry the CMS ctaLabel`).toHaveText(label);
    await expect(cta).toHaveAttribute('href', EXPECTED_BOOK);
  }

  // The header carries both label variants and swaps them with a media query,
  // so its text is asserted per span rather than as one string.
  const header = page.locator('[data-cta="header-book"]');
  await expect(header).toHaveCount(1);
  await expect(header).toHaveAttribute('href', EXPECTED_BOOK);
  await expect(header.locator('.cta-full')).toHaveText(label);
  await expect(header.locator('.cta-short')).toHaveText(compact);
});
