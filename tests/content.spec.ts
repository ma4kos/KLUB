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

/** Which pricing row each homepage teaser card is quoting. */
const TEASER_SOURCES = ['Single Intro Class', 'Drop-In (1 credit)', 'Single Session'];

test('the homepage pricing teaser still matches the pricing table', () => {
  const cards = home.pricingTeaser.cards;
  expect(
    cards.length,
    'the homepage teaser no longer has three cards — update TEASER_SOURCES to match'
  ).toBe(TEASER_SOURCES.length);

  cards.forEach((card, i) => {
    const row = rowNamed(TEASER_SOURCES[i]);
    expect(
      card.price,
      `homepage teaser card "${card.eyebrow}" says ${card.price} but pricing.json says "${row.name}" costs ${row.price}`
    ).toBe(row.price);
  });
});

test('the intro price is consistent everywhere it is repeated', () => {
  const intro = rowNamed('Single Intro Class').price; // "€20"

  expect(studio.ctaLabel, `ctaLabel does not mention the ${intro} intro price`).toContain(intro);
  expect(studio.ctaCompact, `ctaCompact does not mention the ${intro} intro price`).toContain(intro);
  expect(home.bookNote, `the hero book note does not mention the ${intro} intro price`).toContain(
    intro
  );

  const stat = home.stats.find((s) => s.big === intro);
  expect(
    stat,
    `no homepage stat shows the ${intro} intro price any more — stats: ${home.stats
      .map((s) => s.big)
      .join(', ')}`
  ).toBeTruthy();
});

test('every price in llms.txt still exists in the pricing table', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.ok(), `llms.txt returned ${res.status()}`).toBeTruthy();
  const body = await res.text();

  const inPricing = new Set(JSON.stringify(pricing).match(/€\d+/g) ?? []);
  const quoted = Array.from(new Set(body.match(/€\d+/g) ?? []));
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

  // The studio email is linkified from studio.json.
  expect(inline(`Write to ${studio.email}`)).toContain(`href="mailto:${studio.email}"`);
});
