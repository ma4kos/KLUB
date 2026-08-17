/**
 * Shared route list for the KLUB end-to-end suite.
 *
 * Enumerated from C:/Repos/KLUB/dist/sitemap-0.xml and verified against the
 * C:/Repos/KLUB/dist/<route>/index.html folders (checked 2026-08-17). All 16
 * return HTTP 200 on the live site https://klub-cy.netlify.app.
 *
 * Deliberately excluded (not in the sitemap): /admin/ (Decap CMS static app)
 * and /wix-kit/.
 *
 * This file has no `.spec`/`.test` suffix, so Playwright does not collect it as
 * a test file — both routes.spec.ts and seo.spec.ts import ROUTES from here,
 * which keeps the route list single-sourced without re-registering tests.
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
