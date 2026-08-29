/**
 * Shared route list for the KLUB end-to-end suite.
 *
 * The 16 routes in dist/sitemap-0.xml, one per built page folder.
 *
 * Deliberately excluded: /admin/ (the Decap CMS app) and /wix-kit/, neither of
 * which is in the sitemap. /404.html is the 17th built page — it is not a
 * sitemap route, so specs that want it add it explicitly.
 *
 * assets.spec.ts asserts that every sitemap path except '/' has at least one
 * inbound link, so a page added here but linked from nowhere fails the suite.
 *
 * This file has no `.spec`/`.test` suffix, so Playwright does not collect it as
 * a test file — routes.spec.ts, seo.spec.ts, buttons.spec.ts, assets.spec.ts,
 * analytics.spec.ts and breakpoints.spec.ts all import ROUTES from here, which
 * keeps the route list single-sourced without re-registering tests.
 */
export const ROUTES = [
  '/',
  '/about/',
  '/book/',
  '/classes/',
  '/classes/private-sessions/',
  '/classes/reformer-flow/',
  '/classes/reformer-fundamentals/',
  '/classes/reformer-power/',
  '/contact/',
  '/faq/',
  '/founding-member/',
  '/instructors/',
  '/location/',
  '/policies/',
  '/pricing/',
  '/timetable/',
] as const;
