# KLUB-CY Claude Code Migration Kit — Validation Report

**Author:** Manus AI  
**Validated:** 2026-09-03  
**Release candidate:** 1.0.0

## Executive Result

The package passed the deterministic release gate with **453 files, zero validator errors, and zero validator warnings**. The pinned KLUB source built successfully, its focused Playwright suite completed with **193 passing tests and five skips**, the six-collection CMS plan produced exactly **65 deterministic records**, the live read-only Wix preflight resolved the correct account/site and all required non-domain inventories, and the Bsport source/build/CDN check passed with company `6604`, widget `868966`, and HTTP 200 from the widget script.

The remaining prerequisite is deliberate and external: the supplied API key does not have `DOMAINS.READ_CONNECTED_DOMAINS`. The exact custom domain must therefore be entered in `.env.klub-cy.local`, or the permission must be added before automated domain discovery. No Wix write, Netlify deployment, DNS change, publication, payment, billing action, or site deletion was performed during package validation.

## Pinned Configuration

| Setting | Validated value |
|---|---|
| Wix account ID | `8372deba-8664-4ad5-8212-6c10a7f348b1` |
| Wix site ID | `20f11f6f-6ce3-469d-b44c-df397c750848` |
| Wix display name | `KLUB-CY` |
| Wix site type | Premium Classic Editor site, Velo enabled, draft, custom domain attached |
| Architecture | Existing-site **self-managed Headless** with Astro/Netlify frontend |
| Source repository | `https://github.com/ma4kos/KLUB` |
| Pinned source commit | `15ec3d93f187f5ec12bee14e8bd7b11692220002` |
| Protected reference deployment | `https://klub-cy.netlify.app/` |
| Wix-native CMS collections before migration | 0 |
| Existing Wix app-owned collections | 15; preserve all |
| Existing Wix Headless OAuth apps | 0 |
| Existing Wix Forms | 0 |
| Existing Wix CMS backups | 0 |
| Booking system | Preserve Bsport; do not migrate to Wix Bookings |

The existing editor-site replacement path is based on Wix’s documented same-project self-managed Headless migration. It preserves the Wix dashboard/backend and keeps the old editor site available until the external frontend and coordinated domain switch have been validated.[1]

## Validation Matrix

| Gate | Result | Evidence |
|---|---|---|
| Kit file/path closure | PASS | `scripts/validate-kit.py`; 453 files |
| JSON validity | PASS | All packaged JSON parsed |
| Target lock | PASS | Account/site/name/source/architecture exact |
| Credential scan | PASS | No Wix key, password, Bearer token, or local env file in package |
| Python syntax | PASS | Preflight, plan generator, kit validator |
| Node syntax | PASS | Payload transformer, protected baseline capture, Bsport validator |
| Plugin structure | PASS | Plugin manifest, MCP config, marketplace, skill, references, official resources |
| Bundled example validator | PASS | SDK/REST/MCP/CI/prompt/migration examples |
| SDK TypeScript | PASS | Clean temporary install and `npm run typecheck` |
| REST TypeScript | PASS | Clean temporary install and `npm run typecheck` |
| KLUB production build | PASS | `npm run build` |
| KLUB focused Playwright suite | PASS | 193 passed, 5 skipped |
| Wix read-only preflight | PASS with expected domain prerequisite | Target exact; 0 native/15 app CMS; 0 backups; 0 OAuth apps; 0 forms |
| Deterministic CMS transformation | PASS | 4 classes, 6 FAQ sections, 38 FAQ items, 4 pricing groups, 12 pricing items, 1 settings record |
| Exact no-write Wix plan | PASS | 6 collection bodies, 6 Bulk Save bodies, 65 records, valid field/permission/request shapes |
| Bsport integration | PASS | Company 6604; widget 868966; `/book/` fallback; build output; CDN HTTP 200 |
| Protected Netlify baseline | PASS | Password gate unlocked; homepage title/content/visual state verified |
| Destructive-action gates | PASS | Wix writes, production deploy, domain cutover, CMS restore, data deletion, and billing are independently controlled |
| Recovery evidence | PASS | Durable state contract and `RECOVERY_PLAN_TEMPLATE.md` |

## Live Wix Contract Validation

Ten compact schema files and the original composite schemas are bundled under `references/live-schemas/`. The current live schemas resolve the following runtime contracts:

| Operation | Live public URL | Permission |
|---|---|---|
| List data collections | `GET https://www.wixapis.com/data/v2/collections` | `WIX_DATA.LIST_COLLECTIONS` |
| Create data collection | `POST https://www.wixapis.com/data/v2/collections` | `WIX_DATA.CREATE_COLLECTION` |
| Bulk Save data items | `POST https://www.wixapis.com/data/v2/bulk/items/save` | `WIX_DATA.BULK_SAVE` |
| Query data items | `POST https://www.wixapis.com/data/v2/items/query` | `WIX_DATA.QUERY` |
| Generate file upload URL | `POST https://www.wixapis.com/site-media/v1/files/generate-upload-url` | `MEDIA.SITE_MEDIA_FILES_UPLOAD` |
| Create Contact V4 | `POST https://www.wixapis.com/contacts/v4/contacts` | `CONTACTS.MODIFY` |

The List Data Collections live schema explicitly exposes a `paging` query object with `limit` and `offset`; the package preflight’s paging request also returned HTTP 200 against KLUB-CY. The Create Contact live REST schema explicitly includes `allowDuplicates`, whose default is false. The package keeps it false and requires read-before-create/reconciliation.

## Independent Audit Dispositions

Five independent audits examined security, plugin packaging, Wix contracts, prompt execution, and migration safety. The security audit passed. Genuine improvement requests were implemented: four missing compact live schemas were added; the CMS query URL was aligned with the live `publicUrl`; administrator-login variables were removed; conditional idempotency and uncertain-result read-back were made explicit; a recovery-plan template was added; and an executable Bsport validator was added.

Several reported blockers were disproved against the actual files:

| Audit claim | Evidence-based disposition |
|---|---|
| Plugin migration templates were missing | False: the directory contains README, package, transformer, six outputs, route manifest, collection schema, and execution-plan sample |
| `generate_wix_plan.py` calls `requests` without importing it | False: the planner performs no HTTP requests and passed syntax/dry-run validation |
| Validator requires an undocumented `--kit-dir` | False: no package file documents or invokes that option |
| Launcher ignores its repository argument | False: it resolves the argument, builds the plugin path from it, changes directory, and launches Claude there |
| KLUB has no `test:install` script | False: `package.json` defines `playwright install --with-deps chromium firefox webkit` |
| List Data Collections does not support offset paging | False: the live schema defines `paging.limit` and `paging.offset`; the live call passed |
| REST Create Contact lacks `allowDuplicates` | False: the captured live request schema includes it |
| Planner uses a wrong `/items/bulk-save` URL | False: it uses `https://www.wixapis.com/data/v2/bulk/items/save` |
| Prompt package paths are invalid | False for the release layout: the archive intentionally extracts as `tools/klub-cy-wix`, as documented in the manual |

## Runtime Limitation

The sandbox does not have the Claude Code CLI installed, so the final `claude --plugin-dir ...` process could not be launched here. The plugin had already passed its structural, manifest, reference-closure, example, JSON, and TypeScript gates, and the kit includes the exact local runtime commands. The first manual test is therefore the documented local plugin launch and official Wix MCP OAuth authorization.

## Release Acceptance

The ZIP is ready for local evaluation. The recommended first run authorizes Wix backend provisioning but keeps production Netlify deployment and domain cutover disabled. The truthful expected result is **preview migration complete; production deployment/domain cutover pending**. Wix’s official domain migration sequence should be performed only after preview acceptance and an exact DNS/domain before-and-after plan.[1]

## References

[1]: https://dev.wix.com/docs/go-headless/self-managed-headless/get-started/migrate-from-an-existing-wix-site/migrate-a-wix-site-to-a-headless-project "Migrate a Wix Site to a Self-Managed Headless Project"
