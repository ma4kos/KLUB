import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as yaml from 'js-yaml';

/**
 * THE CMS SAFETY NET.
 *
 * Decap writes a file collection back from its DECLARED FIELDS. Whatever the
 * editor saves, the file on disk is rebuilt from the field list — so any JSON
 * key that has no matching field is silently DELETED the first time Izzy or
 * Alex presses Save, and the page that reads it either breaks the build or
 * renders blank. Nothing in the Astro build catches that: the JSON is valid,
 * it is just missing.
 *
 * This spec locks the two halves of the contract together:
 *   - every key in every managed JSON file has a field declared for it, and
 *   - every declared field has data behind it (so a config-only change cannot
 *     ship half-done and greet the owners with an empty form).
 *
 * It runs at node level — no browser, no built site.
 */

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const CONFIG = path.join(ROOT, 'public/admin/config.yml');

type Field = {
  name?: string;
  widget?: string;
  required?: boolean;
  fields?: Field[];
  field?: Field;
  types?: Field[];
};
type FileEntry = { name?: string; label?: string; file: string; fields: Field[] };
type Collection = { name: string; files?: FileEntry[]; folder?: string };
type Config = {
  backend?: { name?: string; branch?: string };
  collections: Collection[];
};

const raw = readFileSync(CONFIG, 'utf8');
const config = yaml.load(raw) as Config;

// Every file entry across every file collection, resolved to disk.
const fileEntries: Array<FileEntry & { abs: string; collection: string }> = [];
for (const collection of config?.collections ?? []) {
  for (const entry of collection.files ?? []) {
    fileEntries.push({
      ...entry,
      collection: collection.name,
      abs: path.join(ROOT, entry.file),
    });
  }
}

test('config.yml parses and points at the right backend', () => {
  expect(config, 'public/admin/config.yml did not parse as YAML').toBeTruthy();
  expect(config.backend?.name).toBe('git-gateway');
  expect(config.backend?.branch).toBe('main');
  expect(fileEntries.length, 'no file collections declared').toBeGreaterThan(0);
});

test('every declared collection file exists on disk and parses as JSON', () => {
  for (const entry of fileEntries) {
    expect(existsSync(entry.abs), `${entry.file} (${entry.collection}) is missing`).toBe(true);
    expect(
      () => JSON.parse(readFileSync(entry.abs, 'utf8')),
      `${entry.file} is not valid JSON`
    ).not.toThrow();
  }
});

/**
 * Compare the declared field tree against the real data tree, at EVERY level.
 *
 * A top-level-only comparison is not enough: Decap rebuilds nested objects and
 * list items from their declared sub-fields too, so an undeclared key nested
 * inside `home.about` is deleted on save exactly like a top-level one. This
 * walks both trees together and reports dotted paths.
 *
 * Returns { orphans, missing } — orphans are data keys with no field (deleted
 * on save); missing are fields with no data (form opens empty, save writes the
 * blank back over whatever the page expected).
 */
function diffTree(
  fields: Field[] | undefined,
  data: unknown,
  at: string,
  acc: { orphans: string[]; missing: string[] }
): void {
  if (!Array.isArray(fields)) return;
  if (data === null || typeof data !== 'object' || Array.isArray(data)) return;

  const record = data as Record<string, unknown>;
  const named = fields.filter((f) => typeof f.name === 'string');
  const declared = new Set(named.map((f) => f.name as string));

  for (const key of Object.keys(record)) {
    if (!declared.has(key)) acc.orphans.push(at ? `${at}.${key}` : key);
  }

  for (const field of named) {
    const name = field.name as string;
    const path = at ? `${at}.${name}` : name;
    if (!(name in record)) {
      // An optional field is allowed to be absent — that is what optional
      // means, and Decap writing a blank back over nothing loses nothing.
      // A REQUIRED field with no data is the real defect: the form opens
      // empty and the first save writes that blank over what the page needs.
      if (field.required !== false) acc.missing.push(path);
      continue;
    }
    const value = record[name];

    // Nested object: recurse straight into its sub-fields.
    if (field.widget === 'object') {
      diffTree(field.fields, value, path, acc);
      continue;
    }

    // List of objects: every item shares one declared shape, so check each.
    // A list declared with a single `field` (or with none at all) holds
    // scalars — there are no keys to compare.
    if (field.widget === 'list' && Array.isArray(field.fields) && Array.isArray(value)) {
      value.forEach((item, i) => diffTree(field.fields, item, `${path}[${i}]`, acc));
    }
  }
}

for (const entry of fileEntries) {
  const label = `${entry.collection}/${entry.name ?? entry.file}`;

  test(`${label}: no JSON key at any depth is missing a CMS field`, () => {
    const data = JSON.parse(readFileSync(entry.abs, 'utf8'));
    const acc = { orphans: [] as string[], missing: [] as string[] };
    diffTree(entry.fields, data, '', acc);
    expect(
      acc.orphans,
      `${entry.file}: Decap rewrites the whole file from its declared fields, so these keys are DELETED the first time an editor presses Save: ${acc.orphans.join(', ')}`
    ).toEqual([]);
  });

  test(`${label}: no CMS field at any depth is missing its data`, () => {
    const data = JSON.parse(readFileSync(entry.abs, 'utf8'));
    const acc = { orphans: [] as string[], missing: [] as string[] };
    diffTree(entry.fields, data, '', acc);
    expect(
      acc.missing,
      `${entry.file}: declared in config.yml but absent from the JSON, so the CMS form opens empty and the first save writes that blank over whatever the page expected: ${acc.missing.join(', ')}`
    ).toEqual([]);
  });
}

/**
 * Walk the declared fields alongside the real data so every image/file widget
 * is checked against the file it actually points at. A photo path that no
 * longer resolves is a broken image on a live sales page.
 */
function collectMediaValues(fields: Field[] | undefined, data: unknown, at: string): string[] {
  const found: string[] = [];
  if (!fields || data === null || data === undefined) return found;

  for (const field of fields) {
    if (!field?.name) continue;
    const value = (data as Record<string, unknown>)[field.name];
    const here = `${at}.${field.name}`;
    if (value === undefined || value === null) continue;

    if (field.widget === 'image' || field.widget === 'file') {
      if (typeof value === 'string' && value.trim() !== '') found.push(`${here}|${value}`);
      continue;
    }
    if (field.widget === 'object') {
      found.push(...collectMediaValues(field.fields, value, here));
      continue;
    }
    if (field.widget === 'list' && Array.isArray(value)) {
      value.forEach((item, i) => {
        if (field.fields) {
          found.push(...collectMediaValues(field.fields, item, `${here}[${i}]`));
        } else if (field.field) {
          // A `field:` list stores flat values, one per declared sub-field.
          if (
            (field.field.widget === 'image' || field.field.widget === 'file') &&
            typeof item === 'string' &&
            item.trim() !== ''
          ) {
            found.push(`${here}[${i}]|${item}`);
          }
        } else if (field.types) {
          const type = (item as Record<string, unknown>)?.type;
          const match = field.types.find((t) => t.name === type);
          if (match) found.push(...collectMediaValues(match.fields, item, `${here}[${i}]`));
        }
      });
    }
  }
  return found;
}

test('every image/file value in the CMS resolves to a real file under public/', () => {
  const broken: string[] = [];
  let checked = 0;

  for (const entry of fileEntries) {
    const data = JSON.parse(readFileSync(entry.abs, 'utf8'));
    for (const hit of collectMediaValues(entry.fields, data, entry.name ?? entry.file)) {
      const [where, value] = hit.split('|');
      checked++;
      // Media is served from public/, so a site-root path maps straight onto it.
      // Anything not root-relative is an external URL and out of scope here.
      if (!value.startsWith('/')) continue;
      if (!existsSync(path.join(ROOT, 'public', value))) broken.push(`${where} -> ${value}`);
    }
  }

  expect(checked, 'no image/file widgets found — has the config been gutted?').toBeGreaterThan(0);
  expect(broken, 'CMS media paths that do not resolve under public/').toEqual([]);
});
