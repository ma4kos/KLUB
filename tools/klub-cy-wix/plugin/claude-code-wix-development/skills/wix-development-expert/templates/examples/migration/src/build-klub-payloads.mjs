import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const usage = `Usage:
  node build-klub-payloads.mjs <KLUB_REPO_ROOT> [OUTPUT_DIR]
  node build-klub-payloads.mjs --help

Reads KLUB's local src/content JSON files and writes deterministic, CMS-ready
candidate payloads. This command performs no Wix API or MCP calls.`;

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(usage);
  process.exit(0);
}

const sourceRoot = process.argv[2];
const outputRoot = process.argv[3] ?? new URL("../output/", import.meta.url).pathname;
if (!sourceRoot) {
  console.error(usage);
  process.exit(2);
}

try {
  const sourceStat = await stat(sourceRoot);
  if (!sourceStat.isDirectory()) throw new Error("not a directory");
} catch (error) {
  console.error(`KLUB_REPO_ROOT is not a readable directory: ${sourceRoot}`);
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}

const readJson = async (relativePath) => {
  const filePath = path.join(sourceRoot, relativePath);
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read required KLUB source ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
};
const hash = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const sourceId = (type, id) => `klub:${type}:${id}`;

const classesSource = await readJson("src/content/classes.json");
const faqSource = await readJson("src/content/faq.json");
const pricingSource = await readJson("src/content/pricing.json");
const studioSource = await readJson("src/content/studio.json");

const classes = classesSource.classes.map((item, index) => ({
  sourceId: sourceId("class", item.slug),
  slug: item.slug,
  name: item.name,
  shortDescription: item.short,
  intro: item.intro,
  level: item.level,
  duration: item.duration,
  capacity: item.capacity,
  priceDisplay: item.price,
  imageSourcePath: item.image,
  imageAlt: item.imageAlt,
  goodFor: item.goodFor,
  whatToExpect: item.expect,
  seoTitle: item.seoTitle,
  seoDescription: item.seoDescription,
  sortOrder: index,
  sourceHash: hash(item),
}));

const faqSections = [];
const faqItems = [];
for (const [sectionIndex, section] of faqSource.sections.entries()) {
  const sectionKey = section.slug ?? `section-${sectionIndex + 1}`;
  const sectionSourceId = sourceId("faq-section", sectionKey);
  faqSections.push({
    sourceId: sectionSourceId,
    title: section.heading ?? section.title ?? "",
    sortOrder: sectionIndex,
    sourceHash: hash(section),
  });
  for (const [itemIndex, item] of section.items.entries()) {
    faqItems.push({
      sourceId: sourceId("faq-item", `${sectionKey}-${itemIndex + 1}`),
      sectionSourceId,
      question: item.question ?? item.q ?? "",
      answer: item.answer ?? item.a ?? "",
      sortOrder: itemIndex,
      sourceHash: hash(item),
    });
  }
}

const pricingGroups = [];
const pricingItems = [];
for (const [groupIndex, group] of pricingSource.tables.entries()) {
  const groupKey = group.id || `group-${groupIndex + 1}`;
  const groupSourceId = sourceId("pricing-group", groupKey);
  pricingGroups.push({
    sourceId: groupSourceId,
    title: group.title,
    blurb: group.blurb ?? "",
    columnLabels: group.cols ?? [],
    sortOrder: groupIndex,
    sourceHash: hash(group),
  });
  for (const [itemIndex, item] of group.rows.entries()) {
    pricingItems.push({
      sourceId: sourceId("pricing-item", `${groupKey}-${itemIndex + 1}`),
      groupSourceId,
      name: item.name,
      priceDisplay: item.price,
      billingUnit: item.per ?? "",
      note: item.note ?? "",
      sortOrder: itemIndex,
      sourceHash: hash(item),
    });
  }
}

const siteSettings = [{
  sourceId: sourceId("settings", "global"),
  ...studioSource,
  sourceHash: hash(studioSource),
}];

await mkdir(outputRoot, { recursive: true });
const payloads = { classes, faqSections, faqItems, pricingGroups, pricingItems, siteSettings };
for (const [name, records] of Object.entries(payloads)) {
  await writeFile(
    path.join(outputRoot, `${name}.json`),
    `${JSON.stringify(records, null, 2)}\n`,
    "utf8",
  );
}

const manifest = {
  generatedAt: new Date().toISOString(),
  sourceRoot: path.resolve(sourceRoot),
  collections: Object.fromEntries(
    Object.entries(payloads).map(([name, records]) => [name, { count: records.length }]),
  ),
  note: "Read-only transform. No Wix API calls were made.",
};
await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
