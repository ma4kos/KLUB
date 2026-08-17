# KLUB website — end-to-end tests (Playwright)

End-to-end tests for the KLUB Pilates website, run with
[`@playwright/test`](https://playwright.dev). They target the **live** temporary
production URL and need **no local dev server or build**.

- Base URL under test: `https://klub-cy.netlify.app` (set in
  `../playwright.config.ts`, built from the `main` branch).
- The real domain `klub.cy` is still being transferred and is not live yet, so
  the netlify.app address is the site under test.

## What is covered

| Spec | What it checks |
| --- | --- |
| `routes.spec.ts` | Every one of the 16 sitemap routes loads (HTTP ok), has exactly one `<h1>`, a non-empty `<title>`, a meta description, a canonical link, and produces no uncaught JavaScript errors. |
| `navigation.spec.ts` | Desktop header nav links go to the right pages and the header "Book Now" CTA reaches `/book/` (desktop project); every internal footer link resolves (both projects); the mobile hamburger opens the drawer and its links navigate (mobile project). |
| `buttons.spec.ts` | Every `.btn` anchor has a valid non-empty href; every "Book" button points to `/book/` while `bookingUrl` is empty. |
| `forms.spec.ts` | The contact and founding-member forms render all fields, carry the hidden Netlify `form-name` input and the `bot-field` honeypot, and native required-field validation blocks an empty submit. **Nothing is submitted to Netlify.** |
| `responsive.spec.ts` | On mobile: the nav collapses to a hamburger, the document has no horizontal overflow, and the hero renders. |
| `seo.spec.ts` | Per page: Open Graph tags exist and at least one JSON-LD block parses; canonical is either `klub.cy` or (on the live netlify.app) `klub-cy.com`; `sitemap-index.xml`, `sitemap-0.xml` and `robots.txt` resolve. |

`routes.ts` is a shared, non-test module holding the single-sourced route list
(imported by `routes.spec.ts` and `seo.spec.ts`).

### Canonical / domain note

The live deploy currently emits a canonical and `og:url` of
`https://klub-cy.com` because the domain-fix pull request (#2) is intentionally
held while the `klub.cy` domain transfer completes. The **intended** canonical
is `https://klub.cy` (already in `dist/` and `src/`). `seo.spec.ts` therefore
accepts either host — this is expected, not a defect. Once PR #2 lands and the
domain is live, the canonical assertion can be tightened to `klub.cy` only.

## Install

From the repository root (`C:/Repos/KLUB`):

```bash
# 1. Install the test runner (dev dependency)
npm i -D @playwright/test

# 2. Install the browsers the suite uses (Chromium + WebKit)
npx playwright install
# or, to install only what this suite needs:
# npx playwright install chromium webkit
```

## Run

```bash
# All projects (desktop-chromium + mobile-safari)
npx playwright test

# One project at a time
npx playwright test --project=desktop-chromium
npx playwright test --project=mobile-safari

# A single spec
npx playwright test tests/routes.spec.ts

# Interactive UI mode
npx playwright test --ui

# Open the HTML report from the last run
npx playwright show-report
```

The two projects defined in `../playwright.config.ts`:

- **`desktop-chromium`** — Desktop Chrome, viewport 1280×800.
- **`mobile-safari`** — WebKit emulating iPhone 13 (390×844).

Some specs are project-aware: desktop header-nav checks run only on
`desktop-chromium` (the desktop nav is hidden below 900px), while the mobile
menu and responsive checks run only on `mobile-safari`. Retries are set to 1.

## package.json scripts to add

`package.json` is **not** modified by this suite. Add these entries to the
existing `"scripts"` block yourself if you want short aliases:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test:e2e": "playwright test",
  "test:e2e:desktop": "playwright test --project=desktop-chromium",
  "test:e2e:mobile": "playwright test --project=mobile-safari",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:report": "playwright show-report"
}
```

(The first three lines already exist — only the `test:e2e*` lines are new.)

## Notes

- The suite is strictly read-only against the live site. No form is ever
  submitted, so no Netlify form entries or emails are generated.
- If the live deploy is briefly unavailable, tests will fail on navigation; the
  single retry usually rides through transient network blips.
