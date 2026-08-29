import { test, expect, type Page } from '@playwright/test';
import { ROUTES } from './routes';
import studio from '../src/content/studio.json' with { type: 'json' };

/**
 * The measurement contract (src/components/Analytics.astro).
 *
 * SHAPE WARNING — read before changing an assertion here. klubTrack() pushes
 * `{ event: name, ...params }` into window.dataLayer ONLY while `gtag` is
 * undefined. The moment Alex sets ga4Id in the CMS, gtag.js loads and the same
 * call becomes `dataLayer.push(arguments)` — an arguments array shaped
 * `['event', name, params]` with no `.event` property at all. A test written
 * against the raw objects would invert the day GA4 is switched on, which is
 * exactly the day nobody wants a mystery red build. Everything below reads
 * events through readEvents(), which normalises both shapes.
 *
 * Runs once (see the `checks` project in playwright.config.ts).
 */

type TrackedEvent = { event?: string; [k: string]: unknown };

async function readEvents(page: Page): Promise<TrackedEvent[]> {
  return page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []).map((e: any) =>
      e && e[0] === 'event' ? { event: e[1], ...(e[2] || {}) } : e
    )
  );
}

const THIRD_PARTY = /googletagmanager\.com|google-analytics\.com|clarity\.ms/;

test('no third-party analytics loads and no cookie is set while the CMS IDs are empty', async ({
  page,
}) => {
  test.skip(
    Boolean(studio.ga4Id) || Boolean(studio.clarityId),
    'studio.json now carries an analytics ID: GA4/Clarity are expected to load, and a consent notice is now REQUIRED before this site is lawful in Cyprus (see docs/handover-for-alex.md). Update this spec deliberately once that notice ships.'
  );

  const thirdParty: string[] = [];
  page.on('request', (r) => {
    if (THIRD_PARTY.test(r.url())) thirdParty.push(r.url());
  });

  for (const route of ['/', '/pricing/', '/book/']) {
    await page.goto(route, { waitUntil: 'load' });
  }

  expect(thirdParty, 'third-party trackers loaded with the CMS analytics IDs empty').toEqual([]);
  const cookies = await page.context().cookies();
  expect(
    cookies.map((c) => c.name),
    'the site set cookies — with no consent banner, that is what makes it unlawful in the EU'
  ).toEqual([]);
});

test('clicking a CTA pushes a cta_click event with the button id', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });

  // Every Book anchor now points at the studio's external booking system, so a
  // real navigation would take window.dataLayer with it (and send CI off-site).
  // A capture-phase preventDefault stops the link being followed while leaving
  // the site's own document-level listener — which runs on the bubble phase —
  // to fire exactly as it does for a real visitor.
  await page.evaluate(() =>
    document.addEventListener('click', (e) => e.preventDefault(), true)
  );
  await page.locator('[data-cta="hero-book"]').dispatchEvent('click');

  const events = await readEvents(page);
  const clicks = events.filter((e) => e.event === 'cta_click');
  expect(clicks.length, 'no cta_click event was recorded').toBeGreaterThan(0);
  expect(clicks[clicks.length - 1].cta_id).toBe('hero-book');
  expect(clicks[clicks.length - 1].page_path).toBe('/');

  // Book buttons additionally raise book_click, which is the conversion signal.
  const bookClicks = events.filter((e) => e.event === 'book_click');
  expect(bookClicks.length, 'no book_click event for the hero Book button').toBeGreaterThan(0);
});

test('scroll depth fires at 25 / 50 / 75 / 90 exactly once each', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.evaluate(async () => {
    // global.css sets `scroll-behavior: smooth`, so scrollTo animates and the
    // scroll handler samples a position that lags far behind the target — which
    // is how thresholds get skipped. Step through the page instead, in small
    // increments, so every one of 25/50/75/90 is genuinely crossed.
    document.documentElement.style.scrollBehavior = 'auto';
    for (let i = 1; i <= 40; i++) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.ceil((max * i) / 40));
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(300);

  const depths = (await readEvents(page))
    .filter((e) => e.event === 'scroll_depth')
    .map((e) => e.percent);

  for (const mark of [25, 50, 75, 90]) {
    expect(
      depths.filter((d) => d === mark).length,
      `scroll_depth ${mark} should fire exactly once, got ${depths.filter((d) => d === mark).length}`
    ).toBe(1);
  }
});

test('section_view fires for the sections the homepage declares', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  await page.waitForTimeout(400);

  const declared = await page.locator('[data-section]').count();
  test.skip(declared === 0, 'the homepage declares no [data-section] blocks');

  const seen = new Set(
    (await readEvents(page)).filter((e) => e.event === 'section_view').map((e) => e.section)
  );
  expect(seen.size, 'no section_view events were recorded').toBeGreaterThan(0);
});

test('every button on every page is instrumented with a unique data-cta', async ({ page }) => {
  const problems: string[] = [];

  for (const route of [...ROUTES, '/404.html']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const ids = await page
      .locator('a.btn')
      .evaluateAll((els) =>
        els.map((e) => ({
          cta: e.getAttribute('data-cta'),
          text: (e.textContent ?? '').replace(/\s+/g, ' ').trim(),
        }))
      );
    expect(ids.length, `no .btn anchors on ${route}`).toBeGreaterThan(0);

    const seen = new Set<string>();
    for (const { cta, text } of ids) {
      if (!cta || cta.trim() === '') {
        problems.push(`${route}: button "${text}" has no data-cta, so its clicks are invisible`);
        continue;
      }
      if (seen.has(cta)) problems.push(`${route}: data-cta="${cta}" is used more than once`);
      seen.add(cta);
    }
  }

  expect(problems, 'CTA instrumentation gaps').toEqual([]);
});
