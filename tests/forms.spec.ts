import { test, expect, type Locator } from '@playwright/test';

/**
 * Netlify form integrity for the two real forms.
 *
 * Both are Netlify-wired static forms. NOTE: Netlify STRIPS data-netlify and
 * netlify-honeypot from the SERVED HTML once it registers the form at deploy
 * time, so on the live site the durable wiring markers are:
 *   - a hidden <input name="form-name"> whose value equals the form name
 *   - a honeypot <input name="bot-field"> inside a hidden <p>
 * We assert those + client-side required validation. We DO NOT submit to
 * Netlify — the empty-submit test relies on native constraint validation
 * blocking the POST, so no request ever leaves the browser.
 *
 * Contact form (/contact/):        name(#c-name) email(#c-email)
 *   phone(#c-phone, optional) message(#c-msg) — submit "Send Message".
 * Founding-member form (/founding-member/): name(#ff-name) email(#ff-email)
 *   phone(#ff-phone, optional) interest(#ff-interest select) —
 *   submit "Join the List".
 */

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
});

test.describe('founding-member form (/founding-member/)', () => {
  test('renders all fields, hidden form-name input and honeypot', async ({ page }) => {
    await page.goto('/founding-member/');
    const form = page.locator('form[name="founding-member"]');
    await assertNetlifyWiring(form, 'founding-member');

    await expect(form.locator('#ff-name')).toBeVisible();
    await expect(form.locator('#ff-email')).toBeVisible();
    await expect(form.locator('#ff-phone')).toBeVisible();
    await expect(form.locator('select#ff-interest')).toBeVisible();
    await expect(form.getByRole('button', { name: 'Join the List' })).toBeVisible();
  });

  test('required validation blocks an empty submit (no Netlify POST)', async ({ page }) => {
    await page.goto('/founding-member/');
    const form = page.locator('form[name="founding-member"]');

    await form.getByRole('button', { name: 'Join the List' }).click();

    await expect(page).toHaveURL(/\/founding-member\/$/);
    const nameValid = await form
      .locator('#ff-name')
      .evaluate((el) => (el as HTMLInputElement).validity.valid);
    expect(nameValid, 'empty required Name should be invalid').toBe(false);
  });
});
