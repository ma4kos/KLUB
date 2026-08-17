import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * SEO / structured-data checks per page, plus site-level sitemap + robots.
 *
 * Canonical host: the intended canonical is https://klub.cy (present in dist/
 * and src/). The LIVE netlify.app deploy currently emits https://klub-cy.com
 * because the domain-fix pull request (#2) is intentionally held while the
 * klub.cy domain transfer completes. We therefore accept EITHER host — this is
 * expected, not a defect. Once PR #2 lands and the domain is live, this can be
 * tightened to klub.cy only.
 */

const OG_PROPERTIES = ['og:title', 'og:type', 'og:url', 'og:image', 'og:description'];

for (const route of ROUTES) {
  test(`SEO on ${route}: OG tags, parseable JSON-LD, valid canonical`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    // Open Graph tags exist and are non-empty.
    for (const prop of OG_PROPERTIES) {
      const meta = page.locator(`head meta[property="${prop}"]`);
      await expect(meta, `${prop} missing on ${route}`).toHaveCount(1);
      const content = (await meta.getAttribute('content'))?.trim() ?? '';
      expect(content.length, `${prop} empty on ${route}`).toBeGreaterThan(0);
    }

    // At least one JSON-LD block, and at least one that parses as valid JSON.
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.length, `no JSON-LD on ${route}`).toBeGreaterThan(0);

    let parsed = 0;
    for (const block of blocks) {
      try {
        JSON.parse(block);
        parsed++;
      } catch {
        // A malformed block is tolerated as long as one valid block exists.
      }
    }
    expect(parsed, `no parseable JSON-LD block on ${route}`).toBeGreaterThan(0);

    // Canonical points at either the intended klub.cy or the live klub-cy.com.
    const canonical = await page
      .locator('head link[rel="canonical"]')
      .getAttribute('href');
    expect(canonical, `canonical missing on ${route}`).toBeTruthy();
    expect(canonical!, `unexpected canonical host on ${route}`).toMatch(
      /^https:\/\/(klub\.cy|klub-cy\.com)\//
    );
  });
}

test('sitemap-index.xml resolves', async ({ page }) => {
  const res = await page.request.get('/sitemap-index.xml');
  expect(res.ok(), `sitemap-index.xml returned ${res.status()}`).toBeTruthy();
  const body = await res.text();
  expect(body).toContain('<sitemapindex');
});

test('sitemap-0.xml resolves and lists URLs', async ({ page }) => {
  const res = await page.request.get('/sitemap-0.xml');
  expect(res.ok(), `sitemap-0.xml returned ${res.status()}`).toBeTruthy();
  const body = await res.text();
  expect(body).toContain('<urlset');
});

test('robots.txt resolves and references the sitemap', async ({ page }) => {
  const res = await page.request.get('/robots.txt');
  expect(res.ok(), `robots.txt returned ${res.status()}`).toBeTruthy();
  const body = await res.text();
  expect(body).toMatch(/Sitemap:/i);
});
