import { test, expect, type Page } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * Broken images and dead links — the breakage an editor is most likely to
 * cause and the one the rest of the suite deliberately looks past.
 *
 * routes.spec.ts swallows "Failed to load resource" console errors on purpose
 * (they are not JavaScript faults), and navigation.spec.ts only walks the
 * hrefs inside the footer on '/'. Between them, a photo repointed at a path
 * that does not exist — or an iPhone HEIC upload the browser cannot decode —
 * ships green. This spec is the check that catches both.
 *
 * Runs once (see the `checks` project in playwright.config.ts): a 404 is a 404
 * on every device, so paying for it nine times buys nothing.
 */

const ALL_PAGES = [...ROUTES, '/404.html'];

/** Scroll to the bottom so lazy images and IntersectionObserver videos load. */
async function revealEverything(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(600);
}

for (const route of ALL_PAGES) {
  test(`every asset on ${route} loads`, async ({ page }) => {
    const bad: string[] = [];
    page.on('response', (r) => {
      // The document response itself is asserted separately (and /404.html is
      // deliberately served as a 404 by some hosts).
      if (r.request().resourceType() === 'document') return;
      if (!r.ok() && r.status() !== 304) bad.push(`${r.status()} ${r.url()}`);
    });
    page.on('requestfailed', (r) => {
      if (r.resourceType() === 'document') return;
      bad.push(`failed ${r.url()} (${r.failure()?.errorText ?? 'unknown'})`);
    });

    await page.goto(route, { waitUntil: 'load' });
    await revealEverything(page);

    expect(bad, `resources failed to load on ${route}`).toEqual([]);

    // A file that downloads fine but cannot be DECODED — the classic HEIC
    // upload — is a 200 with a zero-width image. Only this catches it.
    const undecodable = await page
      .locator('img')
      .evaluateAll((els) =>
        els
          .filter((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth === 0)
          .map((i) => (i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src)
      );
    expect(undecodable, `images that loaded but cannot be displayed on ${route}`).toEqual([]);
  });
}

test('every internal link on every page resolves', async ({ page }) => {
  const seen = new Map<string, string>(); // href -> first page that used it

  for (const route of ALL_PAGES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((els) =>
        els.map((e) => (e as HTMLAnchorElement).getAttribute('href') ?? '').filter(Boolean)
      );
    for (const href of hrefs) {
      const clean = href.split('#')[0];
      if (clean === '' || clean.startsWith('//')) continue;
      if (!seen.has(clean)) seen.set(clean, route);
    }
  }

  expect(seen.size, 'no internal links found anywhere on the site').toBeGreaterThan(0);

  const dead: string[] = [];
  for (const [href, from] of seen) {
    const res = await page.request.get(href);
    if (!res.ok()) dead.push(`${href} -> ${res.status()} (linked from ${from})`);
  }
  expect(dead, 'internal links that do not resolve').toEqual([]);
});

test('no page in the sitemap is an orphan (nothing links to it)', async ({ page }) => {
  const res = await page.request.get('/sitemap-0.xml');
  expect(res.ok(), `sitemap-0.xml returned ${res.status()}`).toBeTruthy();
  const xml = await res.text();

  const sitemapPaths = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g))
    .map((m) => {
      try {
        return new URL(m[1]).pathname;
      } catch {
        return '';
      }
    })
    .filter((p) => p && p !== '/');
  expect(sitemapPaths.length, 'sitemap listed no pages').toBeGreaterThan(0);

  // Every href the site points at, gathered from every page.
  const linked = new Set<string>();
  for (const route of ALL_PAGES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href') ?? ''));
    for (const href of hrefs) {
      const clean = href.split('#')[0].split('?')[0];
      if (!clean.startsWith('/')) continue;
      linked.add(clean.endsWith('/') ? clean : `${clean}/`);
    }
  }

  const orphans = sitemapPaths.filter((p) => !linked.has(p.endsWith('/') ? p : `${p}/`));
  expect(
    orphans,
    'pages in the sitemap that no page links to — visitors can only reach them from search'
  ).toEqual([]);
});
