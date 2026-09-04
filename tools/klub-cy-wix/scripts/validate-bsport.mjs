#!/usr/bin/env node
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

async function text(file) {
  return readFile(file, 'utf8');
}

const repoRoot = path.resolve(arg('--repo-root', '.'));
const outputPath = path.resolve(repoRoot, arg('--output', '.klub-wix-migration/validation/bsport.json'));
const probeCdn = process.argv.includes('--probe-cdn');
const errors = [];
const warnings = [];

const studioPath = path.join(repoRoot, 'src/content/studio.json');
const widgetPath = path.join(repoRoot, 'src/components/BsportWidget.astro');
const bookPagePath = path.join(repoRoot, 'src/pages/book.astro');
const sitePath = path.join(repoRoot, 'src/site.ts');
const distBookPath = path.join(repoRoot, 'dist/book/index.html');

const studio = JSON.parse(await text(studioPath));
const companyId = String(studio.bsportCompanyId || '');
const widgetId = String(studio.bsportWidgetId || '');
if (!/^\d+$/.test(companyId)) errors.push('studio.bsportCompanyId must be a nonempty numeric string');
if (!/^\d+$/.test(widgetId)) errors.push('studio.bsportWidgetId must be a nonempty numeric string');

const widget = await text(widgetPath);
const bookPage = await text(bookPagePath);
const site = await text(sitePath);
const requiredWidgetFragments = [
  "SITE.bsportCompanyId",
  "SITE.bsportWidgetId",
  "https://cdn.bsport.io/scripts/widget.js",
  "window.BsportWidget.mount",
  "widgetType: 'calendar'",
  "data-section=\"booking-calendar\"",
];
for (const fragment of requiredWidgetFragments) {
  if (!widget.includes(fragment)) errors.push(`BsportWidget.astro is missing required fragment: ${fragment}`);
}
if (!bookPage.includes("import BsportWidget") || !bookPage.includes('<BsportWidget />')) {
  errors.push('src/pages/book.astro does not import and render BsportWidget');
}
if (!site.includes("return SITE.bookingUrl || '/book/'")) {
  errors.push('src/site.ts no longer preserves /book/ as the empty-bookingUrl fallback');
}

let builtOutputChecked = false;
try {
  if ((await stat(distBookPath)).isFile()) {
    builtOutputChecked = true;
    const built = await text(distBookPath);
    for (const fragment of ['https://cdn.bsport.io/scripts/widget.js', companyId, widgetId, 'booking-calendar']) {
      if (!built.includes(fragment)) errors.push(`Built /book/ page is missing Bsport contract fragment: ${fragment}`);
    }
  }
} catch {
  warnings.push('dist/book/index.html is absent; run npm run build and rerun this check');
}

let cdn = { checked: false, url: 'https://cdn.bsport.io/scripts/widget.js' };
if (probeCdn) {
  try {
    const response = await fetch(cdn.url, { method: 'GET', signal: AbortSignal.timeout(20_000) });
    cdn = { ...cdn, checked: true, status: response.status, ok: response.status >= 200 && response.status < 400 };
    if (!cdn.ok) errors.push(`Bsport widget CDN returned HTTP ${response.status}`);
    await response.body?.cancel();
  } catch (error) {
    cdn = { ...cdn, checked: true, ok: false, error: String(error) };
    warnings.push(`Bsport CDN probe failed: ${String(error)}`);
  }
}

const result = {
  checkedAt: new Date().toISOString(),
  repoRoot,
  status: errors.length ? 'FAIL' : 'PASS',
  companyId,
  widgetId,
  bookingFallback: '/book/',
  builtOutputChecked,
  cdn,
  errors,
  warnings,
};
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
