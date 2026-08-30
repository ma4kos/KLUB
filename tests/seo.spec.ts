import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * SEO / structured-data checks per page, plus site-level sitemap + robots.
 *
 * Canonical host: https://www.keeplivingunderbalance.com, set once in astro.config.mjs and emitted
 * into every page's canonical link and og:url.
 *
 * JSON-LD: every block must parse. The previous version accepted "at least one
 * parseable block", which the always-valid LocalBusiness block satisfied on
 * every page — so a corrupted FAQPage (the one Google actually shows as rich
 * results) passed unnoticed.
 */

const OG_PROPERTIES = ['og:title', 'og:type', 'og:url', 'og:image', 'og:description'];
const CANONICAL_HOST = /^https:\/\/www\.keeplivingunderbalance\.com\//;

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

    // EVERY JSON-LD block must parse — one bad block is one lost rich result.
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.length, `no JSON-LD on ${route}`).toBeGreaterThan(0);

    for (const [i, block] of blocks.entries()) {
      expect(
        () => JSON.parse(block),
        `JSON-LD block ${i + 1} of ${blocks.length} on ${route} is not valid JSON`
      ).not.toThrow();
    }

    const canonical = await page
      .locator('head link[rel="canonical"]')
      .getAttribute('href');
    expect(canonical, `canonical missing on ${route}`).toBeTruthy();
    expect(canonical!, `unexpected canonical host on ${route}`).toMatch(CANONICAL_HOST);
  });
}

test('/faq/ publishes a valid FAQPage block', async ({ page }) => {
  await page.goto('/faq/', { waitUntil: 'domcontentloaded' });
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();

  const faqPages = blocks
    .map((b) => {
      try {
        return JSON.parse(b);
      } catch {
        return null;
      }
    })
    .filter((o) => o && o['@type'] === 'FAQPage');

  expect(faqPages.length, 'no FAQPage structured data on /faq/').toBe(1);
  const questions = faqPages[0].mainEntity ?? [];
  expect(Array.isArray(questions) && questions.length > 0, 'FAQPage has no questions').toBe(true);
  for (const q of questions) {
    expect(q['@type']).toBe('Question');
    expect((q.name ?? '').length, 'a FAQ question has no text').toBeGreaterThan(0);
    expect((q.acceptedAnswer?.text ?? '').length, `FAQ "${q.name}" has no answer`).toBeGreaterThan(0);
  }
});

test('the sitemap and the canonical link agree on the domain', async ({ page }) => {
  // The site's domain is declared TWICE and nothing connects the two: the
  // canonical link and og:url come from SITE.url in src/site.ts, while the
  // sitemap comes from `site:` in astro.config.mjs. Changing one and not the
  // other tells Google two different things about the same page — the exact
  // mistake that produced the klub.cy / klub-cy.com split.
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const canonical = await page.locator('head link[rel="canonical"]').getAttribute('href');
  const canonicalOrigin = new URL(canonical!).origin;

  const res = await page.request.get('/sitemap-0.xml');
  expect(res.ok(), `sitemap-0.xml returned ${res.status()}`).toBeTruthy();
  const first = (await res.text()).match(/<loc>([^<]+)<\/loc>/);
  expect(first, 'sitemap-0.xml lists no URLs').toBeTruthy();
  const sitemapOrigin = new URL(first![1]).origin;

  expect(
    sitemapOrigin,
    `the sitemap says ${sitemapOrigin} but the canonical link says ${canonicalOrigin} — update BOTH src/site.ts and astro.config.mjs`
  ).toBe(canonicalOrigin);
});

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
