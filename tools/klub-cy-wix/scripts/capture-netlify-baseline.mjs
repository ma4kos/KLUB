#!/usr/bin/env node
import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function parseEnv(text) {
  const result = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const split = line.indexOf('=');
    const key = line.slice(0, split).trim();
    let value = line.slice(split + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

const repoRoot = path.resolve(arg('--repo-root', '.'));
const envPath = path.resolve(repoRoot, arg('--env', '.env.klub-cy.local'));
const outputDir = path.resolve(repoRoot, arg('--output-dir', '.klub-wix-migration/validation/netlify-source'));
const env = parseEnv(await readFile(envPath, 'utf8'));
const sourceUrl = process.env.KLUB_NETLIFY_PREVIEW_URL || env.KLUB_NETLIFY_PREVIEW_URL || 'https://klub-cy.netlify.app/';
const password = process.env.KLUB_NETLIFY_PASSWORD || env.KLUB_NETLIFY_PASSWORD;
if (!password) throw new Error('KLUB_NETLIFY_PASSWORD is missing from the local environment file');

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });

const passwordInput = page.locator('input[type="password"]');
if (await passwordInput.count()) {
  await passwordInput.first().fill(password);
  const submit = page.getByRole('button', { name: /submit|continue|enter/i });
  if (await submit.count()) await submit.first().click();
  else await passwordInput.first().press('Enter');
  await page.waitForLoadState('networkidle', { timeout: 60_000 }).catch(() => {});
}

const title = await page.title();
if (!/KLUB/i.test(title)) throw new Error(`Protected deployment did not unlock to KLUB; received title: ${title}`);
const bodyText = (await page.locator('body').innerText()).replace(/\n{3,}/g, '\n\n');
await page.screenshot({ path: path.join(outputDir, 'homepage-desktop.png'), fullPage: true });
await context.storageState({ path: path.join(outputDir, 'netlify-auth-state.json') });

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, storageState: path.join(outputDir, 'netlify-auth-state.json') });
const mobilePage = await mobile.newPage();
await mobilePage.goto(sourceUrl, { waitUntil: 'networkidle', timeout: 60_000 }).catch(async () => {
  await mobilePage.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
});
await mobilePage.screenshot({ path: path.join(outputDir, 'homepage-mobile.png'), fullPage: true });

const result = {
  checkedAt: new Date().toISOString(),
  sourceUrl,
  title,
  unlocked: true,
  passwordPersisted: false,
  bodyTextFile: 'homepage.txt',
  screenshots: ['homepage-desktop.png', 'homepage-mobile.png'],
  storageStateFile: 'netlify-auth-state.json',
};
await writeFile(path.join(outputDir, 'homepage.txt'), `${bodyText}\n`, 'utf8');
await writeFile(path.join(outputDir, 'capture.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
await mobile.close();
await context.close();
await browser.close();
console.log(JSON.stringify({ ...result, outputDir }, null, 2));
