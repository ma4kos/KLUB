# KLUB website — launch-readiness audit

**Date:** 2026-08-17 · **Site under test:** https://klub-cy.netlify.app (temporary
address; `klub.cy` still transferring) · **Method:** 7 parallel analysis lanes
(static build + live site) + a code review + an implemented Playwright test
suite, cross-checked against live browser spot-checks.

## Verdict: **GO — with fixes**

The site is in strong shape. All 16 pages load, no internal link is broken, the
custom 404 works, and every dimension scores from the mid-70s to high-90s.
Nothing is broken for a visitor. One genuine defect and a short fix list should
be cleared before the public launch on `klub.cy`.

| Dimension | Score |
|---|---:|
| Route & link integrity (live) | 98 |
| Search-engine optimization | 91 |
| Test automation (Playwright suite) | 88 |
| Accessibility (WCAG 2.1 AA) | 87 |
| Forms & content management | 87 |
| Code quality & correctness | 82 |
| AI answer-engine optimization | 78 |
| Performance / speed | 74 |

---

## The one blocker (verified)

**Neither form shows a confirmation after submitting.** Both the contact form and
the founding-member sign-up post to a `?success=true` URL, but **nothing in the
codebase reads that flag** — the only two references to "success" anywhere are
the two form `action` attributes. After signing up, the visitor lands back on an
identical empty form with no thank-you. On a pre-launch site whose entire purpose
is collecting founding-member sign-ups, that silent no-op invites confusion and
duplicate submissions. *(Independently confirmed against `src/` and the built
`dist/`.)*
→ Fix: `src/pages/contact.astro:23` and `src/components/FoundingForm.astro:13`.

---

## Prioritised fixes

### Fix before launch (small, high-value)
1. **Form confirmation message** — the blocker above. A few lines of inline
   script that reveal a "Thanks — you're on the list" message and hide the form
   when `?success=true`. *(Both forms.)*
2. **Caching + security headers** — every static asset is served
   `Cache-Control: max-age=0` (repeat visitors re-validate everything), and 5 of
   6 standard security headers are missing (only HSTS is present). One
   `netlify.toml` headers block fixes both: immutable caching for
   `/_astro`, `/fonts`, `/videos`, `/images`, plus the security headers.
3. **Footer heading levels** — the shared footer uses `<h4>` right after `<h2>`,
   skipping a level on 15 of 16 pages. Promote to `<h2>` — one shared-component
   edit fixes every page (helps both SEO outline and screen-reader navigation).
4. **Form helper-text contrast** — `.form-note` is ~3.1:1 on white (fails AA).
   Switch from `--ink-faint` to `--ink-soft` (#5C544C) in `global.css`.
5. **Add `public/llms.txt`** — a plain-text summary for AI answer engines. High
   value for a brand-new studio with no third-party mentions yet.
6. **Trim two meta descriptions** (home 177 chars, instructors 172) to ~155-160
   and add one `og:locale` (en_GB) to the shared head.

### The biggest quality lever (needs a decision) — homepage video weight
The homepage autoplays **4 videos (~4.5 MB)** and the instructors page **5
(~5.2 MB)**; two clips are oversized (`dubai-studio.mp4` 2.0 MB, `cyprus-pool.mp4`
1.6 MB). `preload="metadata"` doesn't help because autoplay forces buffering, so
all clips download at once and compete with fonts/images on mobile. Options:
re-encode each to <500 KB (720p, no audio), keep one hero autoplay and switch the
rest to click-to-play, and/or lazy-load off-screen clips. *(Everything else about
delivery is excellent — public pages ship ~zero JavaScript and ~14 KB CSS.)*

### After the domain goes live (re-verify on `klub.cy`)
- Merge PR #2 (domain fix), then confirm the live canonical, `og:url`,
  `robots.txt` Sitemap line and sitemap all read `https://klub.cy`, and that
  `www.klub.cy` 301-redirects to the apex. Re-run the route/link sweep.
- Enrich the LocalBusiness (ExerciseGym) schema with the street address, phone,
  geo and opening hours **once they're published**, plus a machine-readable
  `foundingDate` (Sept 2026).

### Nice-to-have (no launch impact)
- WhatsApp number empty → every tailored "message us about X" link silently falls
  back to the plain Instagram profile (needs the real number, or accept the
  fallback consciously). No phone number anywhere on the site.
- Add `BreadcrumbList` schema + `offers`/`courseMode` to the class-page `Course`
  data (AIO).
- Add a visible pause control for the autoplay motion (WCAG 2.2.2).
- Add `scope` to the pricing-table headers; give an on-topic `<h1>` to the
  instructors page (currently a person's name).
- Latent robustness: `Pic.astro` derives the WebP name from `.jpg` only; a couple
  of pages read fixed list indexes that could break a build if an editor deletes
  an item — guard these before non-technical editing begins.
- Remove the leftover `public/wix-kit/` starter page (184 KB, ships publicly but
  unlinked/noindex).

---

## The test suite (implemented)

A full Playwright end-to-end suite was written to the repo, targeting the live
URL (no dev server needed):

- `playwright.config.ts` — two projects: **desktop-chromium** (1280×800) and
  **mobile-safari** (iPhone 13).
- `tests/routes.spec.ts` — every route loads, one `<h1>`, title, description,
  canonical, no JS errors.
- `tests/navigation.spec.ts` — desktop header nav, footer links, mobile
  hamburger open/navigate.
- `tests/buttons.spec.ts` — every CTA/Book button has a valid href; Book → `/book/`.
- `tests/forms.spec.ts` — both forms render, carry the Netlify hidden `form-name`
  + honeypot, and block an empty submit (no real submission).
- `tests/responsive.spec.ts` — mobile menu collapse, no horizontal overflow.
- `tests/seo.spec.ts` — OG tags, JSON-LD parses, sitemap/robots resolve.
- `tests/README.md` — install/run instructions.

**Run it:**
```bash
cd C:/Repos/KLUB
npm i -D @playwright/test && npx playwright install
npx playwright test                 # all
npx playwright test --project=mobile-safari
npx playwright show-report
```
The suite is read-only and never submits a form.

---

## Notes
- **SEMrush audit not run:** the SEMrush connector isn't attached to this session,
  and a SEMrush site-audit is best pointed at the real `klub.cy` once it's live.
  The SEO + AIO lanes above cover the same technical-SEO substance in the meantime.
- **Live Lighthouse/Core-Web-Vitals** needs a real browser run (deferred); static
  evidence predicts strong LCP/CLS/TBT with the video bandwidth as the only real
  mobile risk.
