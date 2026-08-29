/**
 * Shared helpers for the KLUB end-to-end suite.
 *
 * This file has no `.spec`/`.test` suffix, so Playwright does not collect it as
 * a test file.
 *
 * WHY THIS EXISTS: several specs used to gate themselves on the Playwright
 * project NAME (`test.info().project.name !== 'desktop-chromium'`). Project
 * names are free text in playwright.config.ts — when the matrix was renamed
 * (desktop-chromium -> desktop-chrome) every one of those tests started
 * skipping and the whole suite still reported green. Gate on the VIEWPORT
 * WIDTH instead: it is the thing the CSS media queries actually respond to,
 * and it stays correct however the projects are renamed or extended.
 */
import { test } from '@playwright/test';

/**
 * The header/nav breakpoint. Below or at this width the desktop nav and the
 * header `.book-cta` are `display: none` and the hamburger takes over, and the
 * mobile sticky booking bar appears.
 *
 * Source of truth: `@media (max-width: 900px)` in src/components/Header.astro
 * and src/components/StickyCTA.astro.
 */
export const NAV_BREAKPOINT = 900;

/** The width at/below which the header shows the compact priced CTA label. */
export const HEADER_CTA_BREAKPOINT = 1100;

/** Viewport width of the currently running project (0 if it declares none). */
export function viewportWidth(): number {
  return test.info().project.use.viewport?.width ?? 0;
}

/** Run only where the desktop header is visible (wider than NAV_BREAKPOINT). */
export function skipUnlessDesktop(): void {
  const width = viewportWidth();
  test.skip(
    width <= NAV_BREAKPOINT,
    `desktop nav is hidden at ${width}px (<= ${NAV_BREAKPOINT}px)`
  );
}

/** Run only where the hamburger is visible (at or below NAV_BREAKPOINT). */
export function skipUnlessMobile(): void {
  const width = viewportWidth();
  test.skip(
    width > NAV_BREAKPOINT,
    `hamburger is hidden at ${width}px (> ${NAV_BREAKPOINT}px)`
  );
}
