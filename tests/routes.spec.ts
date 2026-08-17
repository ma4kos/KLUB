import { test, expect, type Page } from '@playwright/test';
import { ROUTES } from './routes';

/**
 * Attach console/page-error collectors BEFORE navigation.
 * We treat uncaught JS exceptions (pageerror) as hard failures. For console
 * errors we ignore resource-load failures (e.g. a missing image/video 404
 * surfaced as "Failed to load resource"), which are not JavaScript faults and
 * are out of scope for a runtime-error check.
 */
function collectErrors(page: Page) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/Failed to load resource/i.test(text)) return;
    consoleErrors.push(text);
  });
  return { pageErrors, consoleErrors };
}

for (const route of ROUTES) {
  test.describe(`route ${route}`, () => {
    test('loads, unique <h1>, title, description, canonical, no JS errors', async ({ page }) => {
      const { pageErrors, consoleErrors } = collectErrors(page);

      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response, `no response object for ${route}`).not.toBeNull();
      expect(response!.ok(), `status ${response!.status()} for ${route}`).toBeTruthy();

      // Exactly one <h1>.
      await expect(page.locator('h1')).toHaveCount(1);

      // Non-empty <title>.
      const title = await page.title();
      expect(title.trim().length, `empty <title> on ${route}`).toBeGreaterThan(0);

      // A single, non-empty meta description.
      const desc = page.locator('head meta[name="description"]');
      await expect(desc).toHaveCount(1);
      const descContent = (await desc.getAttribute('content'))?.trim() ?? '';
      expect(descContent.length, `empty meta description on ${route}`).toBeGreaterThan(0);

      // A single canonical link with a non-empty href.
      const canonical = page.locator('head link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const canonicalHref = await canonical.getAttribute('href');
      expect(canonicalHref, `empty canonical href on ${route}`).toBeTruthy();

      // No uncaught JavaScript errors.
      expect(pageErrors, `uncaught page error(s) on ${route}`).toEqual([]);
      expect(consoleErrors, `console error(s) on ${route}`).toEqual([]);
    });
  });
}
