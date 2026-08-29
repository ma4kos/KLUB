import { test, expect, type Locator } from '@playwright/test';
import studio from '../src/content/studio.json' with { type: 'json' };

/**
 * Netlify form integrity for the two real forms.
 *
 * Both are Netlify-wired static forms. NOTE: Netlify STRIPS data-netlify and
 * netlify-honeypot from the SERVED HTML once it registers the form at deploy
 * time, so on the live site the durable wiring markers are:
 *   - a hidden <input name="form-name"> whose value equals the form name
 *   - a honeypot <input name="bot-field"> inside a hidden <p>
 * We assert those + client-side required validation. We DO NOT submit to
 * Netlify — the invalid-submit tests rely on native constraint validation
 * blocking the POST, so no request ever leaves the browser.
 *
 * Contact form (/contact/):        name(#c-name) email(#c-email)
 *   phone(#c-phone, optional) message(#c-msg) — submit "Send Message".
 * Founding-member form: rendered by src/components/FoundingForm.astro on FOUR
 *   pages, two of them in the `compact` variant (email + consent only, with
 *   name/phone/interest as empty hidden inputs so Netlify still registers one
 *   identical field schema). Each instance posts back to ITS OWN page, so a
 *   homepage signup confirms on the homepage instead of being dumped on the
 *   founding-member sales page.
 */

const SUBMIT_LABEL = studio.foundingForm?.submitLabel ?? 'Join the List';

const FOUNDING_PAGES: Array<{ path: string; source: string; compact: boolean }> = [
  { path: '/', source: 'home', compact: true },
  { path: '/timetable/', source: 'timetable', compact: true },
  { path: '/book/', source: 'book', compact: false },
  { path: '/founding-member/', source: 'founding-page', compact: false },
];

async function assertNetlifyWiring(form: Locator, formName: string) {
  await expect(form).toBeVisible();
  // data-netlify / netlify-honeypot are NOT asserted here: Netlify removes them
  // from the served HTML after it registers the form at deploy time. The hidden
  // form-name input below is the durable proof the deployed form is wired.
  await expect(form.locator('input[name="form-name"]')).toHaveValue(formName);
  // Honeypot present but not visible to users.
  await expect(form.locator('input[name="bot-field"]')).toHaveCount(1);
  await expect(form.locator('input[name="bot-field"]')).toBeHidden();
}

test.describe('contact form (/contact/)', () => {
  test('renders all fields, hidden form-name input and honeypot', async ({ page }) => {
    await page.goto('/contact/');
    const form = page.locator('form[name="contact"]');
    await assertNetlifyWiring(form, 'contact');

    await expect(form.locator('#c-name')).toBeVisible();
    await expect(form.locator('#c-email')).toBeVisible();
    await expect(form.locator('#c-phone')).toBeVisible();
    await expect(form.locator('#c-msg')).toBeVisible();
    await expect(form.getByRole('button', { name: 'Send Message' })).toBeVisible();

    // The message field is a textarea and required.
    await expect(form.locator('textarea#c-msg')).toHaveAttribute('required', '');
  });

  test('required validation blocks an empty submit (no Netlify POST)', async ({ page }) => {
    await page.goto('/contact/');
    const form = page.locator('form[name="contact"]');

    await form.getByRole('button', { name: 'Send Message' }).click();

    // Native constraint validation must block navigation to the success URL.
    await expect(page).toHaveURL(/\/contact\/$/);
    const nameValid = await form
      .locator('#c-name')
      .evaluate((el) => (el as HTMLInputElement).validity.valid);
    expect(nameValid, 'empty required Name should be invalid').toBe(false);
  });

  test('the success panel shows only after a successful post', async ({ page }) => {
    await page.goto('/contact/?success=true');
    const ok = page.locator('#contact-success');
    await expect(ok, 'no confirmation after a successful contact submit').toBeVisible();
    await expect(ok).toHaveAttribute('role', 'status');
    await expect(page.locator('form[name="contact"]')).toBeHidden();
  });

  test('the success panel stays hidden on a normal visit', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page.locator('#contact-success')).toBeHidden();
    await expect(page.locator('form[name="contact"]')).toBeVisible();
  });
});

test.describe('founding-member form (all four pages)', () => {
  for (const { path, source, compact } of FOUNDING_PAGES) {
    test(`${path} renders the ${compact ? 'compact' : 'full'} variant, wired to Netlify`, async ({
      page,
    }) => {
      await page.goto(path);
      const form = page.locator('form[name="founding-member"]');
      await expect(form, `expected exactly one founding form on ${path}`).toHaveCount(1);
      await assertNetlifyWiring(form, 'founding-member');

      // Which page the signup came from, shown as a column in Netlify.
      await expect(form.locator('input[name="source"]')).toHaveValue(source);

      // Netlify registers ONE field schema per form name, so every variant must
      // declare the same four data fields — the compact ones as hidden inputs.
      for (const field of ['name', 'email', 'phone', 'interest']) {
        await expect(
          form.locator(`[name="${field}"]`),
          `${path}: field "${field}" missing — Netlify would drop this column`
        ).toHaveCount(1);
      }

      // Visible inputs exist only in the full variant.
      const visibleFields = ['#ff-name', '#ff-phone', '#ff-interest'];
      for (const sel of visibleFields) {
        await expect(form.locator(sel)).toHaveCount(compact ? 0 : 1);
      }
      await expect(form.locator('#ff-email')).toBeVisible();
      await expect(form.getByRole('button', { name: SUBMIT_LABEL })).toBeVisible();

      // The form must post back to the page it is on, otherwise a homepage
      // signup lands on the founding-member sales page instead of confirming
      // in place.
      const action = (await form.getAttribute('action')) ?? '';
      expect(action, `${path}: form action "${action}" does not return to this page`).toBe(
        `${path}?success=true`
      );
    });

    test(`${path} will not submit without the consent box`, async ({ page }) => {
      await page.goto(path);
      const form = page.locator('form[name="founding-member"]');

      if (!compact) await form.locator('#ff-name').fill('Test Visitor');
      await form.locator('#ff-email').fill('visitor@example.com');
      // Deliberately leave #ff-consent unchecked.

      await form.getByRole('button', { name: SUBMIT_LABEL }).click();

      // Native constraint validation blocks the POST: the URL never changes.
      await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, '\\/')}$`));
      const missing = await form
        .locator('#ff-consent')
        .evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
      expect(
        missing,
        'the marketing-consent box must be required — without it the email list is not lawful to use'
      ).toBe(true);
    });

    test(`${path} confirms in place after a successful signup`, async ({ page }) => {
      await page.goto(`${path}?success=true`);
      await expect(page.locator('form[name="founding-member"]')).toBeHidden();
      const panels = page.locator('.form-success:visible');
      await expect(
        panels,
        `no confirmation shown on ${path} after a successful signup`
      ).not.toHaveCount(0);
    });
  }
});
