#!/usr/bin/env node
/**
 * Verifies a built Wix site against klub-wix-site-spec.json.
 *
 * WHY. A build agent reporting "done" is not evidence. This re-reads the live
 * site through the Wix REST API and compares it, item by item, with the spec it
 * was built from — so a missing page, a dropped media file, an invented price
 * or a connected domain shows up as a failure rather than a paragraph of prose.
 *
 * Run it where Wix is reachable and WIX_API_KEY is set:
 *   node tools/wix-native/verify-wix-site.mjs <siteId>
 *
 * Exits non-zero if any MUST check fails. Prints a table either way.
 * Read-only: it performs no writes and never prints the API key.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(readFileSync(join(HERE, 'klub-wix-site-spec.json'), 'utf8'));

const siteId = process.argv[2];
const key = process.env.WIX_API_KEY;
if (!siteId) { console.error('usage: verify-wix-site.mjs <siteId>'); process.exit(2); }
if (!key) { console.error('WIX_API_KEY is not set in the environment'); process.exit(2); }

const results = [];
const check = (level, name, pass, detail = '') =>
  results.push({ level, name, pass, detail });

/**
 * Wix method names move; resolve the current ones via the MCP documentation
 * tools rather than trusting these. Each entry says what it needs to read, so a
 * caller can repoint the path without touching the comparison logic.
 */
const ENDPOINTS = {
  site:  { need: 'site metadata incl. display name',      url: (id) => `https://www.wixapis.com/site-list/v2/sites/${id}` },
  pages: { need: 'the site\'s pages with slugs + SEO',     url: (id) => `https://www.wixapis.com/site-pages/v1/pages?siteId=${id}` },
  media: { need: 'media items in the site\'s Media Manager', url: () => `https://www.wixapis.com/site-media/v1/files` },
  domains: { need: 'domains connected to the site',        url: (id) => `https://www.wixapis.com/domains/v1/connected-domains?siteId=${id}` },
};

async function get(which) {
  const ep = ENDPOINTS[which];
  const res = await fetch(ep.url(siteId), {
    headers: { Authorization: key, 'wix-site-id': siteId, Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${which}: HTTP ${res.status} — needs ${ep.need}. ${body.slice(0, 200)}`);
  }
  return res.json();
}

const norm = (s) => String(s || '').trim().toLowerCase().replace(/\/+$/, '');

try {
  // 1. The site exists and is the one we were told to check.
  const site = await get('site').catch((e) => ({ _error: e.message }));
  check('MUST', 'site is readable', !site._error, site._error || '');

  // 2. Every page in the spec exists at its exact slug, with its SEO title.
  const pageData = await get('pages').catch((e) => ({ _error: e.message }));
  if (pageData._error) {
    check('MUST', 'pages readable', false, pageData._error);
  } else {
    const live = (pageData.pages || pageData.items || []).map((p) => ({
      slug: norm(p.slug ?? p.pageUriSEO ?? p.url),
      title: p.seo?.title ?? p.title ?? '',
    }));
    const wanted = [{ slug: '', seo: spec.homepage.seo }, ...spec.pages.map((p) => ({ slug: norm(p.slug), seo: p.seo }))];
    for (const w of wanted) {
      const hit = live.find((l) => l.slug === w.slug || l.slug === w.slug.replace(/^\//, ''));
      check('MUST', `page ${w.slug || '/'} exists`, Boolean(hit));
      if (hit && w.seo?.title) {
        check('SHOULD', `page ${w.slug || '/'} keeps its SEO title`,
          norm(hit.title) === norm(w.seo.title),
          hit.title ? `live: "${hit.title}"` : 'no title set');
      }
    }
  }

  // 3. Every media file in the manifest reached the Media Manager.
  const mediaData = await get('media').catch((e) => ({ _error: e.message }));
  if (mediaData._error) {
    check('SHOULD', 'media readable', false, mediaData._error);
  } else {
    const files = (mediaData.files || mediaData.items || []);
    const names = new Set(files.map((f) => norm(f.displayName ?? f.fileName ?? f.id)));
    const missing = spec.media.filter((m) => {
      const base = norm(m.path.split('/').pop());
      return ![...names].some((n) => n.includes(base.replace(/\.[a-z0-9]+$/, '')));
    });
    check('MUST', `all ${spec.media.length} media files uploaded`, missing.length === 0,
      missing.length ? `missing: ${missing.map((m) => m.path).join(', ')}` : '');
  }

  // 4. GUARDRAIL: no domain may be connected during the build.
  const dom = await get('domains').catch((e) => ({ _skipped: e.message }));
  if (dom._skipped) {
    check('SHOULD', 'domain check ran', false, dom._skipped);
  } else {
    const connected = (dom.domains || dom.items || []).map((d) => d.domainName ?? d.name);
    check('MUST', 'no production domain connected',
      !connected.some((d) => norm(d).includes('keeplivingunderbalance')),
      connected.length ? `connected: ${connected.join(', ')}` : 'none');
  }

  // 5. GUARDRAIL: the build must not have targeted a protected site.
  const protectedIds = ['20f11f6f-6ce3-469d-b44c-df397c750848', 'cc7fa0d1-d750-44b4-99dc-e53cf7900b0a'];
  check('MUST', 'target is a new site, not a protected one',
    !protectedIds.includes(siteId), protectedIds.includes(siteId) ? `refused: ${siteId}` : '');
} catch (e) {
  check('MUST', 'verification completed', false, e.message);
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`\nVerifying site ${siteId} against the spec\n`);
for (const r of results) {
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${pad(r.level, 6)} ${r.name}${r.detail ? `  — ${r.detail}` : ''}`);
}
const failedMust = results.filter((r) => !r.pass && r.level === 'MUST');
console.log(`\n${results.filter((r) => r.pass).length}/${results.length} passed, ${failedMust.length} blocking failure(s)\n`);
process.exit(failedMust.length ? 1 : 0);
