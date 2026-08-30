# KLUB website — end-to-end tests (Playwright)

End-to-end tests for the KLUB Pilates website.

**The suite builds the site and serves it itself.** `playwright.config.ts`
declares a `webServer` that runs `npm run build && npm run preview`, so a test
run needs no dev server, no deploy, and no network. This matters: the Netlify
deploy previews are password-protected, and pointing the suite at them made
every request return an HTTP 401 password page while the run still went green.

To test a real deploy — or to re-run against a preview you already have up —
set `BASE_URL`, which switches the local server off:

```bash
BASE_URL=https://deploy-preview-12--klub-cy.netlify.app npx playwright test
npm run test:fast   # same thing against http://localhost:4321
```

(On Windows: `set BASE_URL=http://localhost:4321 && npx playwright test`.)

## What is covered

| Spec | What it checks |
| --- | --- |
| `routes.spec.ts` | Every one of the 16 sitemap routes loads (HTTP ok), has exactly one `<h1>`, a non-empty `<title>`, a meta description, a canonical link, and produces no uncaught JavaScript errors. |
| `navigation.spec.ts` | Desktop header nav links go to the right pages and the header Book CTA carries the booking href the CMS declares (asserted, never clicked — it points off-site); every internal footer link resolves; the mobile hamburger opens the drawer and its links navigate. |
| `buttons.spec.ts` | Every `.btn` anchor on all 17 built pages has a valid href; every Book button points **exactly** at `studio.json` → `bookingUrl` (or `/book/` when that is empty); the homepage carries each primary Book CTA exactly once with the CMS label. |
| `forms.spec.ts` | The contact form and all four founding-member instances render, carry the Netlify `form-name` input and `bot-field` honeypot, declare one identical field schema, post back to their own page, refuse to submit without the consent box, and show their success panel only after a successful post. **Nothing is submitted to Netlify.** |
| `responsive.spec.ts` | At/below 900px: the nav collapses to a hamburger, the document has no horizontal overflow, the hero renders. |
| `breakpoints.spec.ts` | A 30-width sweep across every CSS breakpoint the stylesheets declare: no overflow, exactly one nav affordance, the header CTA keeps its price, the sticky bar appears only below 900px. |
| `seo.spec.ts` | Per page: Open Graph tags, **every** JSON-LD block parses, canonical is `https://www.keeplivingunderbalance.com`. Plus a valid `FAQPage` on `/faq/`, sitemap/robots, and that the sitemap and canonical agree on the domain. |
| `cms-config.spec.ts` | The CMS safety net — see below. |
| `assets.spec.ts` | Every image, video, font and script on all 17 pages loads; no image is undecodable (a HEIC upload); every internal link resolves; no sitemap page is an orphan. |
| `analytics.spec.ts` | No third-party tracker loads and no cookie is set while the CMS analytics IDs are empty; `cta_click`, `book_click`, `section_view` and `scroll_depth` fire; every button carries a unique `data-cta`. |
| `content.spec.ts` | The homepage price teaser matches the pricing table, the €20 intro price is consistent in all five places it appears, every price in `llms.txt` still exists in `pricing.json`, and `inline()` escapes hostile input. |
| `a11y.spec.ts` | axe-core (WCAG 2.0/2.1 A + AA) on `/`, `/pricing/`, `/classes/` at 1280px and 390px, plus keyboard operation of the mobile menu and the marquee pause button. |

`routes.ts` and `helpers.ts` have no `.spec` suffix, so Playwright does not
collect them as test files.

### The CMS safety net (`cms-config.spec.ts`)

Decap rewrites a file collection's whole JSON from its **declared fields**. Any
key in `src/content/**.json` that has no matching field in
`public/admin/config.yml` is silently deleted the first time Izzy or Alex
presses Save — the JSON stays valid, it is just missing, and the page renders
blank or the build fails. This spec asserts both directions of that contract
(no orphan keys, no field without data) plus that every image path in the CMS
resolves under `public/`. **Adding a field to a content JSON file without
adding it to `config.yml` will now fail the build.** That is the point.

### Never gate a test on a project name

Seven desktop navigation tests once read
`test.skip(test.info().project.name !== 'desktop-chromium', …)`. When the
project matrix was renamed to `desktop-chrome`, the condition became true in
every project: the tests all skipped, and the suite reported green while
testing nothing.

Layout-dependent specs therefore gate on the **viewport width** via
`helpers.ts` (`skipUnlessDesktop()` / `skipUnlessMobile()`, around the real
900px header breakpoint) — the thing the CSS actually responds to. Specs that
only need to run once are pinned to a project in `playwright.config.ts`, where
a rename cannot hide them. Please keep it that way.

## Projects

| Project | Device / width | Runs |
| --- | --- | --- |
| `desktop-chrome` | Chrome 1280×800 | the device matrix |
| `desktop-firefox` | Firefox 1280×800 | the device matrix |
| `desktop-safari` | WebKit 1440×900 | the device matrix |
| `mobile-safari-small` | iPhone SE, 375px | the device matrix |
| `mobile-safari` | iPhone 13, 390px | the device matrix |
| `mobile-chrome` | Pixel 7, 412px | the device matrix |
| `tablet-portrait` | iPad Mini, 768px | the device matrix |
| `tablet-landscape` | iPad Mini landscape, 1024px | the device matrix |
| `breakpoints` | Chromium, viewport driven per test | `breakpoints.spec.ts` |
| `checks` | Chromium 1280×800 | `analytics`, `assets`, `cms-config`, `content` — device-independent, once each |
| `a11y` | Chromium | `a11y.spec.ts`, non-blocking in CI while findings are triaged |

## Install and run

```bash
npm ci
npm run test:install          # Chromium + Firefox + WebKit
npm test                      # everything
npm run test:local            # desktop-chrome + breakpoints + checks (fast)
npm run test:a11y             # accessibility only
npx playwright test tests/forms.spec.ts
npx playwright test --ui
npm run test:report           # open the last HTML report
```

Only Chromium ships in some sandboxes; the Firefox and WebKit projects need
`npx playwright install firefox webkit` first. CI (`.github/workflows/tests.yml`)
runs four sharded jobs — desktop, mobile-tablet, breakpoints, checks — plus a
non-blocking accessibility job.

## Known gaps

- **`scrollable-region-focusable`** is in `DEFERRED_RULES` in `a11y.spec.ts`.
  The pricing tables scroll horizontally at 390px inside `.table-scroll`, which
  a keyboard user cannot reach. One-line fix in `src/pages/pricing.astro`:
  `tabindex="0"` plus `role="region"` and an `aria-label` on that wrapper.
- **Escape does not close the mobile menu.** `a11y.spec.ts` carries the test,
  marked `test.fixme`; `src/components/Header.astro` needs a keydown handler.
- **`content.spec.ts` loads `inline()` from source** rather than importing it,
  because `src/lib/inline.ts` does `import studio from '…/studio.json'` with no
  ESM import attribute — legal to Vite, not to Node. Adding
  `with { type: 'json' }` there would let the test import the module directly.

## Notes

- The suite never submits a form, so no Netlify entries or emails are created.
- Book buttons are asserted by attribute and never clicked: `bookingUrl` points
  at the studio's external booking system, and clicking it would navigate CI
  off-site.
