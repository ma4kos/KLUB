#!/usr/bin/env python3
"""Generate the curated Wix development example library."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

FILES: dict[str, str] = {
    "README.md": r'''# Wix Development Examples Library

This library contains validated configuration, TypeScript, REST, migration, CI, and prompt examples for Claude Code and Manus agents. Every example is designed to be copied and adapted only after the current Wix documentation or MCP method schema confirms the target operation.

| Area | Files | Purpose |
|---|---|---|
| MCP | `mcp/*.json`, `mcp/Tool_Routing.md` | Connect Claude Code or another MCP-compatible client and select the correct Wix tool class |
| SDK | `sdk/src/*.ts` | OAuth, API-key, and Wix-managed Headless CMS patterns |
| REST | `rest/src/*.ts` | A scope-aware Wix REST wrapper and cursor-pagination helper |
| Migration | `migration/src/build-klub-payloads.mjs` and manifests | Convert the KLUB JSON source into deterministic, idempotent import candidates without performing writes |
| CI | `ci/wix-preview.yml` | Install, validate, and build a Wix-managed Headless project; release remains approval-gated |
| Prompts | `prompts/Prompt_Library.md` | Schema-first Claude Code/Wix MCP workflows |
| Validation | `validation/validate_examples.py` | JSON, path, secret-placeholder, and migration-output checks |

## Safety Rule

These examples do not create a Wix site, publish, change DNS, process payment, or perform bulk writes. Keep Wix credentials in environment variables or the agent/MCP secret store. Retrieve the exact method schema before adapting a business API call.
''',
    "mcp/claude-code-remote.json": r'''{
  "mcpServers": {
    "wix-mcp-remote": {
      "type": "http",
      "url": "https://mcp.wix.com/mcp"
    }
  }
}
''',
    "mcp/api-key-npx.json": r'''{
  "mcpServers": {
    "wix-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@wix/mcp-remote@latest",
        "https://mcp.wix.com/mcp",
        "--header",
        "Authorization:${WIX_API_KEY}",
        "--header",
        "wix-account-id:${WIX_ACCOUNT_ID}"
      ],
      "env": {
        "WIX_API_KEY": "${WIX_API_KEY}",
        "WIX_ACCOUNT_ID": "${WIX_ACCOUNT_ID}"
      }
    }
  }
}
''',
    "mcp/Tool_Routing.md": r'''# Wix MCP Tool Routing

Use `WixREADME` first for ordinary Wix management requests. Use documentation tools for read-only research and exact-schema confirmation. Resolve the account, site, and installed-app context before a site-scoped write.

| Intent | Preferred tool class | Required gate |
|---|---|---|
| Understand a workflow | `WixREADME` or business-flow documentation | None; read only |
| Find SDK/REST/Headless/app/WDS guidance | Matching documentation search tool | None; read only |
| Read a full article | `ReadFullDocsArticle` | None; read only |
| Confirm request/response fields | `ReadFullDocsMethodSchema` or REST spec search | Required before code or writes |
| Choose a site | `ListWixSites`, then site-context lookup | Confirm the selected site |
| Read or change site business data | `CallWixSiteAPI` for one request; `ExecuteWixAPI` for loops/pagination/chains | Present plan and obtain write approval |
| Create, update, publish, or otherwise manage a site at account scope | `ManageWixSite` | Sensitive-action confirmation |
| Upload media | Media upload tool | Confirm destination site, file count, and deduplication rule |

Never use account-level site management for per-site business data. Never infer a method contract from a documentation-search summary. Never send administrative credentials to frontend code.
''',
    "sdk/package.json": r'''{
  "name": "wix-sdk-examples",
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@wix/data": "^1.0.502",
    "@wix/sdk": "^1.21.5",
    "@wix/stores": "latest"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
''',
    "sdk/tsconfig.json": r'''{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
''',
    "sdk/src/oauth-client.ts": r'''import { createClient, OAuthStrategy } from "@wix/sdk";
import { productsV3 } from "@wix/stores";

export type StoredTokens = {
  accessToken: { value: string; expiresAt: number };
  refreshToken: { value: string; role: string };
};

export function createVisitorOrMemberClient(
  clientId: string,
  tokens?: StoredTokens,
) {
  return createClient({
    modules: { productsV3 },
    auth: OAuthStrategy({ clientId, tokens }),
  });
}

export async function listVisibleProducts(
  client: ReturnType<typeof createVisitorOrMemberClient>,
) {
  return client.productsV3.queryProducts({
    filter: { visible: { $eq: true } },
    cursorPaging: { limit: 10 },
  });
}
''',
    "sdk/src/api-key-client.ts": r'''import { ApiKeyStrategy, createClient } from "@wix/sdk";
import { productsV3 } from "@wix/stores";

export function createSiteAdminClient(options: {
  apiKey: string;
  siteId: string;
  accountId?: string;
}) {
  return createClient({
    auth: ApiKeyStrategy({
      apiKey: options.apiKey,
      siteId: options.siteId,
      ...(options.accountId ? { accountId: options.accountId } : {}),
    }),
    modules: { productsV3 },
  });
}

export function createAccountAdminClient(options: {
  apiKey: string;
  accountId: string;
}) {
  return createClient({
    auth: ApiKeyStrategy({
      apiKey: options.apiKey,
      accountId: options.accountId,
    }),
  });
}

export async function listVisibleProducts(
  client: ReturnType<typeof createSiteAdminClient>,
) {
  return client.productsV3.queryProducts({
    filter: { visible: { $eq: true } },
    cursorPaging: { limit: 10 },
  });
}
''',
    "sdk/src/managed-headless-cms.ts": r'''import { items } from "@wix/data";

export type CatalogItemView = {
  _id: string;
  name?: string;
  description?: string;
  image?: unknown;
};

export async function loadCatalogItems(
  collectionId = "catalog-items",
): Promise<CatalogItemView[]> {
  try {
    const { items: rows } = await items
      .query(collectionId)
      .ascending("name")
      .limit(50)
      .find();

    return rows.map(({ _id, name, description, image }) => ({
      _id,
      name,
      description,
      image,
    }));
  } catch (error) {
    console.error(`Failed to load ${collectionId}`, error);
    return [];
  }
}
''',
    "sdk/README.md": r'''# Wix SDK Examples

`oauth-client.ts` follows Wix's visitor/member Headless client pattern. Persist refreshed tokens securely and reuse the client to maintain the session. `api-key-client.ts` is a trusted-backend/admin example and must never be bundled into browser code. `managed-headless-cms.ts` follows the direct module pattern used by official Wix-managed Astro templates, where the managed environment supplies authorization.

Install and type-check with `npm install && npm run typecheck`. Package versions are pinned to the official Wix Headless template baseline where possible; verify current versions before production use.
''',
    "rest/package.json": r'''{
  "name": "wix-rest-examples",
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
''',
    "rest/tsconfig.json": r'''{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM"]
  },
  "include": ["src/**/*.ts"]
}
''',
    "rest/src/wix-rest-client.ts": r'''export type WixScope =
  | { siteId: string; accountId?: never }
  | { accountId: string; siteId?: never };

export type WixRestClientOptions = WixScope & {
  apiKey: string;
  baseUrl?: string;
};

export class WixRestClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly siteId?: string;
  private readonly accountId?: string;

  constructor(options: WixRestClientOptions) {
    this.baseUrl = (options.baseUrl ?? "https://www.wixapis.com").replace(/\/$/, "");
    this.apiKey = options.apiKey;
    if (options.siteId) {
      this.siteId = options.siteId;
    } else {
      this.accountId = options.accountId;
    }
  }

  async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Authorization", this.apiKey);
    headers.set("Content-Type", "application/json");
    if (this.siteId) headers.set("wix-site-id", this.siteId);
    if (this.accountId) headers.set("wix-account-id", this.accountId);

    const response = await fetch(`${this.baseUrl}/${path.replace(/^\//, "")}`, {
      ...init,
      headers,
    });

    const text = await response.text();
    const body = text ? JSON.parse(text) : undefined;
    if (!response.ok) {
      throw new Error(
        `Wix API ${response.status} ${response.statusText}: ${JSON.stringify(body)}`,
      );
    }
    return body as T;
  }
}
''',
    "rest/src/paginate.ts": r'''export type CursorPage<T> = {
  items: T[];
  pagingMetadata?: {
    cursors?: { next?: string };
    hasNext?: boolean;
  };
};

export async function collectCursorPages<T>(options: {
  fetchPage: (cursor?: string) => Promise<CursorPage<T>>;
  maxPages?: number;
  maxItems?: number;
}): Promise<T[]> {
  const maxPages = options.maxPages ?? 100;
  const maxItems = options.maxItems ?? 10_000;
  const collected: T[] = [];
  let cursor: string | undefined;

  for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
    const page = await options.fetchPage(cursor);
    collected.push(...page.items);
    if (collected.length >= maxItems) return collected.slice(0, maxItems);

    const next = page.pagingMetadata?.cursors?.next;
    const hasNext = page.pagingMetadata?.hasNext ?? Boolean(next);
    if (!hasNext || !next || next === cursor) return collected;
    cursor = next;
  }

  throw new Error(`Pagination stopped after maxPages=${maxPages}.`);
}
''',
    "rest/README.md": r'''# Wix REST Examples

The REST wrapper enforces either site scope or account scope and adds the current Wix header names. Supply the endpoint path and request body only after retrieving the exact current method schema. The pagination helper is intentionally endpoint-agnostic because Wix API paging shapes and request fields must be confirmed per method.

Keep the API key in server-side environment variables. Never instantiate this client in browser-delivered code.
''',
    "migration/package.json": r'''{
  "name": "klub-wix-migration-examples",
  "private": true,
  "type": "module",
  "scripts": {
    "build-payloads": "node src/build-klub-payloads.mjs"
  }
}
''',
    "migration/src/build-klub-payloads.mjs": r'''import { createHash } from "node:crypto";
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
''',
    "migration/route-manifest.json": r'''{
  "canonicalHost": "https://www.keeplivingunderbalance.com",
  "routes": [
    "/",
    "/about/",
    "/book/",
    "/classes/",
    "/classes/foundations-reformer/",
    "/classes/signature-reformer/",
    "/classes/mat-pilates/",
    "/classes/private-sessions/",
    "/contact/",
    "/faq/",
    "/founding-member/",
    "/instructors/",
    "/location/",
    "/policies/",
    "/pricing/",
    "/timetable/",
    "/404.html"
  ],
  "redirects": [],
  "rule": "Preserve every route exactly; add reviewed 301 redirects only for unavoidable differences."
}
''',
    "migration/collection-schemas.sample.json": r'''{
  "collections": {
    "Classes": {
      "identityField": "sourceId",
      "uniqueFields": ["sourceId", "slug"],
      "requiredFields": ["sourceId", "slug", "name", "imageAlt", "sourceHash"]
    },
    "FaqSections": {
      "identityField": "sourceId",
      "uniqueFields": ["sourceId"],
      "requiredFields": ["sourceId", "sortOrder", "sourceHash"]
    },
    "FaqItems": {
      "identityField": "sourceId",
      "uniqueFields": ["sourceId"],
      "requiredFields": ["sourceId", "sectionSourceId", "question", "answer", "sortOrder", "sourceHash"]
    },
    "PricingGroups": {
      "identityField": "sourceId",
      "uniqueFields": ["sourceId"],
      "requiredFields": ["sourceId", "title", "sortOrder", "sourceHash"]
    },
    "PricingItems": {
      "identityField": "sourceId",
      "uniqueFields": ["sourceId"],
      "requiredFields": ["sourceId", "groupSourceId", "name", "priceDisplay", "sortOrder", "sourceHash"]
    },
    "SiteSettings": {
      "identityField": "sourceId",
      "uniqueFields": ["sourceId"],
      "requiredFields": ["sourceId", "email", "sourceHash"]
    }
  },
  "warning": "Translate this logical schema into the exact current Wix CMS collection API only after retrieving the method schemas."
}
''',
    "migration/execution-plan.sample.json": r'''{
  "project": "klub-to-wix",
  "deliveryMode": "management_and_website",
  "destination": {
    "accountId": "<WIX_ACCOUNT_ID>",
    "siteId": "<WIX_SITE_ID>",
    "projectPath": "<WIX_MANAGED_HEADLESS_PROJECT_PATH>",
    "pinned": false
  },
  "approval": {
    "mappingApproved": false,
    "writesApproved": false,
    "releaseApproved": false
  },
  "operations": [
    { "id": "verify-destination", "mode": "read", "dependsOn": [] },
    { "id": "install-required-apps", "mode": "write", "dependsOn": ["verify-destination"] },
    { "id": "create-cms-collections", "mode": "write", "dependsOn": ["install-required-apps"] },
    { "id": "upload-media", "mode": "idempotent-write", "dependsOn": ["verify-destination"] },
    { "id": "import-cms-records", "mode": "idempotent-write", "dependsOn": ["create-cms-collections", "upload-media"] },
    { "id": "bind-frontend", "mode": "repository-write", "dependsOn": ["import-cms-records"] },
    { "id": "preview-and-test", "mode": "read-test", "dependsOn": ["bind-frontend"] },
    { "id": "release", "mode": "sensitive-write", "dependsOn": ["preview-and-test"] }
  ],
  "rollback": {
    "frontend": "Keep the existing Astro deployment live until Wix cutover acceptance.",
    "dns": "Revert DNS to the existing host if post-cutover critical checks fail.",
    "data": "Use source-to-Wix crosswalks and operation logs; never bulk-delete without explicit approval."
  }
}
''',
    "migration/README.md": r'''# KLUB Migration Examples

The transformer requires the path to a local KLUB repository checkout. Display its complete usage without performing work:

```bash
node src/build-klub-payloads.mjs --help
```

Run the payload builder with an explicit source and optional output directory:

```bash
npm run build-payloads -- /path/to/KLUB ./output
```

A missing or unreadable source path exits with status `2` and prints an actionable usage message. The script reads only the four required `src/content/*.json` files and creates deterministic import candidates with stable source identities and record hashes. It does not call Wix or change the source repository. Use the resulting manifest for count review, mapping approval, exact-schema adaptation, and idempotent import code generation.

The collection schema is logical, not an API request. Retrieve current Wix CMS method schemas before creating collections or writing items.
''',
    "ci/wix-preview.yml": r'''name: Validate Wix-managed Headless project

on:
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Typecheck
        run: npm run typecheck --if-present
      - name: Test
        run: npm test --if-present
      - name: Build with Wix CLI
        run: npm run build

# Release is deliberately omitted. Add a separately protected release job only after
# verifying the current Wix CLI non-interactive authentication and release commands,
# storing credentials as repository secrets, and requiring an environment approval.
''',
    "prompts/Prompt_Library.md": r'''# Claude Code and Wix MCP Prompt Library

## Schema-First SDK Task

> Use the installed Wix plugin and MCP. Identify the relevant Wix skill, search the SDK documentation, retrieve the full method schema, and cite the source URL. Then propose TypeScript code. Do not write or run it until you have shown the target account/site scope, permissions, inputs, pagination behavior, error cases, and validation plan.

## Site-Scoped Read

> Call the Wix routing/readme tool, list available sites, resolve the selected site's context and installed apps, retrieve the exact REST method schema, and execute a read-only query. Return the site ID/name, method, request, result count, paging state, and source documentation.

## Controlled Write

> Prepare a dry-run plan for this Wix write. Resolve the account and site, retrieve the exact method schema, validate every field, calculate the affected record count, define the source-identity deduplication rule, read-back verification, and rollback. Stop and ask for explicit approval before calling the write tool.

## Existing-Site Migration Discovery

> Analyze the supplied repository and public website using browser-backed evidence. Produce routes, content types, assets with hashes/dimensions, design tokens, components, forms, integrations, SEO, structured data, tests, and business workflows. Freeze a source manifest. Do not create a Wix site or import anything.

## Migration Mapping

> Using the frozen source manifest, map each entity and route to Wix-managed Headless, CMS, Media Manager, Forms/CRM, Bookings, Stores/eCommerce, Blog, Events, Members, SEO, or retained custom code. Include account/site scope, interface, prerequisites, crosswalk key, write semantics, validation, and rollback. Highlight every uncertain mapping.

## KLUB Payload Generation

> Run the read-only KLUB payload builder. Compare output counts and hashes to the source inventory. Propose exact Wix CMS schemas only after retrieving the current collection and data-item method schemas. Do not make API calls.

## MCP Tool Contract Audit

> Read the current Wix MCP documentation and repository. Produce a table of every tool, its intent, read/write nature, scope, required context, and confirmation gate. Flag differences from any screenshots or prior documentation as date-sensitive changes.

## Error Recovery

> Classify the failure as authentication, permission, account/site scope, missing app, schema validation, pagination/rate limit, CLI environment, stale artifact, or service error. Retrieve the relevant current documentation, preserve the operation state, attempt at most two distinct targeted recoveries, and record an actionable blocker if the problem persists.

## Preview and Release

> Build the Wix-managed Headless project and produce a preview. Run route, link, asset, accessibility, SEO, structured-data, form, booking, analytics, and visual-parity checks. Summarize unresolved gaps by severity. Stop before release and request explicit approval with rollback instructions.
''',
    "validation/validate_examples.py": r'''#!/usr/bin/env python3
"""Validate the generated Wix examples without contacting Wix."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
failures: list[str] = []

for path in ROOT.rglob("*.json"):
    if "node_modules" in path.parts:
        continue
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        failures.append(f"Invalid JSON {path.relative_to(ROOT)}: {exc}")

for path in ROOT.rglob("*"):
    if not path.is_file() or "node_modules" in path.parts:
        continue
    if path == Path(__file__).resolve() or path.name == "generate_examples.py":
        continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    if re.search(r"(?:sl\.|sk-|wix_[A-Za-z0-9]{16,})", text):
        failures.append(f"Potential hardcoded secret in {path.relative_to(ROOT)}")

required = [
    "mcp/claude-code-remote.json",
    "sdk/src/oauth-client.ts",
    "sdk/src/api-key-client.ts",
    "rest/src/wix-rest-client.ts",
    "migration/src/build-klub-payloads.mjs",
    "prompts/Prompt_Library.md",
]
for relative in required:
    if not (ROOT / relative).is_file():
        failures.append(f"Missing required example: {relative}")

migration_output = ROOT / "migration/output/manifest.json"
if migration_output.exists():
    manifest = json.loads(migration_output.read_text(encoding="utf-8"))
    expected = {
        "classes": 4,
        "faqSections": 6,
        "faqItems": 38,
        "pricingGroups": 4,
        "pricingItems": 12,
        "siteSettings": 1,
    }
    actual = {k: v["count"] for k, v in manifest["collections"].items()}
    if actual != expected:
        failures.append(f"Unexpected KLUB transform counts: {actual!r} != {expected!r}")

if failures:
    print("\n".join(failures), file=sys.stderr)
    raise SystemExit(1)
print("Example library validation passed.")
''',
}


def main() -> None:
    for relative, content in FILES.items():
        path = ROOT / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    print(json.dumps({"files_written": len(FILES), "root": str(ROOT)}, indent=2))


if __name__ == "__main__":
    main()
