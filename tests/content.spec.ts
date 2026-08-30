import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import home from '../src/content/home.json' with { type: 'json' };
import pricing from '../src/content/pricing.json' with { type: 'json' };
import studio from '../src/content/studio.json' with { type: 'json' };

/**
 * Content integrity — the prices are repeated in eight places and the CMS lets
 * an editor change any one of them on its own.
 *
 * The homepage teaser cards mirror rows of the pricing table; the €20 intro
 * price is baked into the CTA label, the compact CTA label, the hero note and
 * a headline stat; and public/llms.txt restates the whole price list for AI
 * search engines. Nothing in the build connects them — llms.txt had already
 * drifted once. These assertions are the connection.
 *
 * Runs once (see the `checks` project in playwright.config.ts).
 */

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

type Row = { name: string; price: string; per?: string; note?: string };
const allRows: Row[] = pricing.tables.flatMap((t) => t.rows as Row[]);
const rowNamed = (name: string): Row => {
  const row = allRows.find((r) => r.name === name);
  if (!row) throw new Error(`pricing.json has no row named "${name}"`);
  return row;
};

/** The pricing row the homepage "Start Here" offer is quoting. */
const OFFER_SOURCE = 'Intro Offer (3 credits)';

test('the homepage intro offer still matches the pricing table', () => {
  const row = rowNamed(OFFER_SOURCE);
  expect(
    home.intro.offer,
    `the homepage offer line "${home.intro.offer}" does not quote the ${row.price} price of pricing.json's "${row.name}" — an editor changed one without the other`
  ).toContain(row.price);
});

test('any price a CTA label quotes still exists in the pricing table', () => {
  // The Option-1 labels carry no price today, but the CMS lets an editor put
  // one back — if they do, it must be a price the pricing table actually has.
  const PRICE = /€\s*\d+(?:[.,]\d{2})?/g;
  const normalise = (s: string) => s.replace(/\s+/g, '').replace(',', '.');
  const inPricing = new Set((JSON.stringify(pricing).match(PRICE) ?? []).map(normalise));

  for (const label of [studio.ctaLabel, studio.ctaCompact, home.intro.offer]) {
    for (const amount of (label.match(PRICE) ?? []).map(normalise)) {
      expect(
        inPricing.has(amount),
        `"${label}" quotes ${amount}, which appears nowhere in pricing.json`
      ).toBeTruthy();
    }
  }
});

test('every price in llms.txt still exists in the pricing table', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.ok(), `llms.txt returned ${res.status()}`).toBeTruthy();
  const body = await res.text();

  // Match decimals too: the CMS price pattern allows "€12,50" and "€12.50", and
  // a whole-euro-only regex would read both as "€12" and let real drift pass.
  const PRICE = /€\s*\d+(?:[.,]\d{2})?/g;
  const normalise = (s: string) => s.replace(/\s+/g, '').replace(',', '.');
  const inPricing = new Set((JSON.stringify(pricing).match(PRICE) ?? []).map(normalise));
  const quoted = Array.from(new Set((body.match(PRICE) ?? []).map(normalise)));
  expect(quoted.length, 'llms.txt quotes no prices at all').toBeGreaterThan(0);

  const drifted = quoted.filter((amount) => !inPricing.has(amount));
  expect(
    drifted,
    'prices quoted in public/llms.txt that no longer appear in pricing.json — AI search engines are being told the wrong price'
  ).toEqual([]);
});

/**
 * inline() unit tests.
 *
 * src/lib/inline.ts imports studio.json without an ESM import attribute, which
 * Vite accepts but Node does not — so the module cannot be imported directly
 * from a test. It is loaded here from source with that one import replaced and
 * its (two) type annotations stripped. If the file ever grows syntax this
 * cannot handle, the import throws and this test goes red rather than quietly
 * passing. See tests/README.md for the one-line fix that would remove the need.
 */
async function loadInline(): Promise<(s: string) => string> {
  const src = readFileSync(path.join(ROOT, 'src/lib/inline.ts'), 'utf8')
    .replace(
      /^\s*import\s+studio\s+from\s+['"][^'"]+['"];?\s*$/m,
      `const studio = ${JSON.stringify({ email: studio.email })};`
    )
    .replace(/:\s*string/g, '');
  const mod = await import(
    `data:text/javascript;base64,${Buffer.from(src).toString('base64')}`
  );
  return mod.inline;
}

test('inline() renders CMS emphasis and escapes everything else', async () => {
  const inline = await loadInline();

  // *word* becomes the serif italic accent.
  expect(inline('a *balanced* life')).toBe('a <span class="ital">balanced</span> life');

  // ~text~ becomes the small superscript-ish mark used by the stats.
  expect(inline('50~′~')).toBe('50<small>′</small>');

  // A newline becomes a line break (the hero heading relies on this).
  expect(inline('Keep\nliving')).toBe('Keep<br />living');

  // Markup pasted into the CMS is escaped, never executed.
  const hostile = inline('<script>alert(1)</script>');
  expect(hostile).toContain('&lt;script&gt;');
  expect(hostile).not.toContain('<script');

  // The studio email is linkified from studio.json. The href is
  // percent-encoded (encodeURIComponent) so that an address containing ? & or
  // # — all of which the CMS email pattern permits — cannot inject headers
  // into the visitor's mail client. The visible text stays human-readable.
  const linked = inline(`Write to ${studio.email}`);
  expect(linked).toContain(`href="mailto:${encodeURIComponent(studio.email)}"`);
  expect(linked).toContain(`>${studio.email}</a>`);

  // Quotes are escaped: without this an address like
  // `x" onmouseover="alert(1)@example.com` would break out of the href
  // attribute. Asserted on the escaper's real behaviour, not on studio.json,
  // so the guarantee holds whatever the studio's address becomes.
  const quoted = inline('say "hello"');
  expect(quoted).toBe('say &quot;hello&quot;');
  expect(quoted).not.toContain('"hello"');
});
