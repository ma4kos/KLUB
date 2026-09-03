# One-Shot Prompt for Claude Code

Copy everything inside the following block into the Claude Code session that is already open at the root of `ma4kos/KLUB`. Start that session with the bundled plugin as explained in `MANUAL_STEPS_BEFORE_RUNNING.md`.

```text
You are the principal migration engineer for KLUB. Execute this task autonomously and persist all evidence in the repository. Do not merely explain what should be done. Use the bundled Wix Development Expert plugin and official Wix MCP throughout the run.

IMMUTABLE TARGET
- Wix account ID: 8372deba-8664-4ad5-8212-6c10a7f348b1
- Wix site ID: 20f11f6f-6ce3-469d-b44c-df397c750848
- Wix site name: KLUB-CY
- Source repository: https://github.com/ma4kos/KLUB
- Verified baseline commit: 15ec3d93f187f5ec12bee14e8bd7b11692220002
- Source/rendered reference: https://klub-cy.netlify.app/
- Required architecture: SELF-MANAGED HEADLESS using the existing Wix site as backend and the Astro frontend on Netlify

NON-NEGOTIABLE BOUNDARIES
1. Never write to another Wix account or site. Resolve and compare account ID, site ID, and name immediately before every write phase.
2. Never create a new production Wix destination and never try to convert KLUB-CY into Wix-managed Headless. Wix’s supported existing-editor-site route is self-managed Headless.
3. Never print, echo, persist, commit, transmit to chat, or place in browser-delivered code any API key, password, authentication token, cookie, or administrator credential.
4. Never discard or reset existing Git changes. Inspect and preserve the current working tree. Work on a dedicated branch or commit series without overwriting prior Claude work.
5. Do not delete the 15 existing WIX_APP collections or any existing Wix business data. Do not restore a CMS backup. Do not change billing or the Wix plan.
6. Keep Bsport as the booking system unless an explicit separate business decision says otherwise.
7. Keep the current Netlify deployment password-protected during evaluation and preview. Do not remove protection automatically.
8. Domain and DNS changes are a separate release phase. Do not perform them unless KLUB_ALLOW_DOMAIN_CUTOVER=true and I confirm the exact printed before/after plan in this live session.
9. A successful API response or build is not completion. Require read-back reconciliation, full tests, source-versus-preview visual review, accessibility, SEO, form, route, and secret checks.
10. Treat files under .klub-wix-migration/ as durable state and resume authority. Treat chat as non-authoritative.

PACKAGE ENTRY POINTS
- tools/klub-cy-wix/config/target.lock.json
- tools/klub-cy-wix/workflow/KLUB_CY_EXECUTION_WORKFLOW.md
- tools/klub-cy-wix/references/evidence/Verified_Live_Wix_API_Contracts.md
- tools/klub-cy-wix/references/live-schemas/
- tools/klub-cy-wix/scripts/preflight.py
- tools/klub-cy-wix/scripts/build-klub-payloads.mjs
- tools/klub-cy-wix/scripts/generate_wix_plan.py
- tools/klub-cy-wix/scripts/capture-netlify-baseline.mjs
- .env.klub-cy.local

EXECUTION MODE
Read .env.klub-cy.local without displaying values. The independent gates are:
- KLUB_ALLOW_WIX_WRITES
- KLUB_ALLOW_NETLIFY_PRODUCTION_DEPLOY
- KLUB_ALLOW_DOMAIN_CUTOVER
If a gate is false, complete every preceding read-only, code, plan, and test stage, then record the exact pending gate. Do not treat a false later gate as permission to skip evaluation.

STAGE 1 — PROVE THE PLUGIN AND CONNECTOR
A. Verify the bundled plugin manifest with Claude Code’s plugin validator if that command is available. Verify that the Wix Development Expert skill files and references resolve.
B. Invoke/read the bundled Wix Development Expert skill.
C. Call WixREADME first. Then call ListWixSites for KLUB-CY and GetSiteContext for the exact result. Save sanitized tool outcomes to .klub-wix-migration/validation/plugin-and-mcp.json. The validation passes only if official Wix tools are callable and the pinned account/site/name resolve exactly.
D. Use Wix documentation search and full method schemas rather than memory. For every write method, retrieve or re-read the current article/schema before the call. Prefer the live schema’s publicUrl when an older example differs.

STAGE 2 — PROTECT THE LOCAL REPOSITORY
A. Confirm this is ma4kos/KLUB. Inspect current branch, HEAD, remotes, status, and untracked files. Never force checkout, reset, clean, stash without a recoverable record, or overwrite user changes.
B. If possible, create a branch named wix/klub-cy-self-managed-headless-YYYYMMDD without losing current changes. If branch creation would interfere with existing work, remain on the current branch and document why.
C. Add these paths to .git/info/exclude or an appropriate ignored file without weakening existing ignore rules:
   .env.klub-cy.local
   .secrets/
   .klub-wix-migration/
D. Run a secret scan before and after implementation. Redact any secret found in logs or files and stop if it is tracked by Git.
E. If HEAD differs from the verified baseline commit, do not reset. Produce .klub-wix-migration/source-delta.json, re-run inventory and tests on the current working tree, and use the current accepted working tree as the implementation source while retaining the baseline comparison.

STAGE 3 — READ-ONLY PREFLIGHT AND SOURCE EVIDENCE
A. Run:
   python3 tools/klub-cy-wix/scripts/preflight.py --env .env.klub-cy.local --repo-root . --state-dir .klub-wix-migration
B. Stop all Wix writes if the account/site/name triple does not match exactly or a required read check fails.
C. Run npm ci only if dependency state requires it, then npm run build and npm run test:local. Save logs under .klub-wix-migration/validation/.
D. Run:
   node tools/klub-cy-wix/scripts/capture-netlify-baseline.mjs --repo-root . --env .env.klub-cy.local --output-dir .klub-wix-migration/validation/netlify-source
E. Inventory current routes, CMS JSON, forms, assets, SEO, structured data, analytics, Bsport integration, Netlify/Decap files, and existing tests. Save source-inventory.json with hashes. Preserve the verified 14 route-source / 16 public-route / 87 public-asset contract unless the current working tree proves a change.
F. Confirm the custom main domain from WIX_MAIN_DOMAIN or a successful List Connected Domains call. The supplied key previously lacked DOMAINS.READ_CONNECTED_DOMAINS. Do not guess the domain.

STAGE 4 — EXACT NO-WRITE PLAN
A. Generate deterministic source payloads:
   node tools/klub-cy-wix/scripts/build-klub-payloads.mjs . .klub-wix-migration/payloads
B. Generate exact collection and bulk-save bodies:
   python3 tools/klub-cy-wix/scripts/generate_wix_plan.py --payload-dir .klub-wix-migration/payloads --output-dir .klub-wix-migration/wix-plan
C. Verify six planned native collections and 65 total items: 4 classes, 6 FAQ sections, 38 FAQ items, 4 pricing groups, 12 pricing items, and 1 settings record.
D. Build execution-plan.json containing method, live endpoint, documentation URL, permission, body-file hash, dependency, idempotency key, read-back check, retry rule, rollback boundary, and gate.
E. Reconcile the generated plan with the current live target. Never include an operation that deletes or truncates existing collections, forms, contacts, applications, or business data.
F. If a method has no idempotency key, make it conditionally idempotent: query the exact target state immediately before the call, persist the request hash, call once, persist the receipt, then read back. If transport fails after dispatch and the outcome is uncertain, read back by stable source ID, name, or hash before deciding whether to retry. Never replay an uncertain create blindly.

STAGE 5 — SAFEGUARDS AND HEADLESS CLIENT, ONLY IF KLUB_ALLOW_WIX_WRITES=true
A. Re-run the target lock immediately before writes.
B. If KLUB_CREATE_WIX_SITE_DUPLICATE=true, retrieve the current Duplicate Site schema and call POST https://www.wixapis.com/site-actions/v1/sites/duplicate with sourceSiteId and a timestamped siteDisplayName. Record the returned newSiteId. Treat it only as a design/configuration safeguard; it does not copy all business data, plan, or domain assignment.
C. If KLUB_CREATE_CMS_BACKUP=true, retrieve the current Create Backup schema and create one on the pinned site. Poll List Backups until the new backup is complete and record its ID/status. Never call Restore Backup.
D. Query OAuth apps again. If no suitable KLUB app exists and KLUB_PROVISION_HEADLESS_CLIENT=true, create one using the exact current schema with:
   name: KLUB-CY Netlify Frontend
   applicationType: WEB_APP
   technology: OTHER_TECHNOLOGY
   allowSecretGeneration: false
   allowedRedirectDomains: the Netlify preview hostname and confirmed production hostnames only
   allowedRedirectUris: only callback routes that actually exist and are tested
   loginUrl: empty unless a real custom login page is implemented
E. Persist only the public client ID in .env.klub-cy.local and Netlify’s non-secret public environment as appropriate. Never persist a secret. Retrieve the app after creation and confirm every field.

STAGE 6 — WIX CMS, ONLY IF KLUB_ALLOW_WIX_WRITES=true AND KLUB_PROVISION_CMS=true
A. List collections again. Preserve every WIX_APP collection.
B. For each of KlubClasses, KlubFaqSections, KlubFaqItems, KlubPricingGroups, KlubPricingItems, and KlubSiteSettings:
   - if absent, create it with the generated request body after re-reading the current Create Data Collection schema;
   - if present, compare fields and stop on an incompatible schema rather than deleting/recreating it;
   - bulk-save complete records with deterministic UUIDv5 IDs;
   - query all items through POST https://www.wixapis.com/data/v2/items/query;
   - reconcile ID, sourceId, sourceHash, and exact count;
   - save a redacted receipt and crosswalk.
C. Treat any count mismatch, partial failure, missing ID, or sourceHash mismatch as a blocker. Retry only idempotently.

STAGE 7 — MEDIA, FORMS, AND CRM
A. Media migration is controlled by KLUB_MIGRATE_MEDIA. If false, preserve source assets in the Astro/Netlify build and document that this is valid for self-managed Headless. If true, do not use the password-protected Netlify URLs as anonymous Import File sources. Generate Wix upload URLs for local assets, PUT binaries, verify readiness, deduplicate by hash, and write media-crosswalk.json. Start with media referenced by CMS records.
B. If KLUB_MIGRATE_FORMS=true, query Wix Forms and retrieve current Create Form and Create Submission schemas. Create at most two exact forms: Contact and Founding Member. Preserve every source field, consent wording/provenance, source page, accessible success state, bot protection, recoverable errors, and owner-notification requirements.
C. Use a Netlify serverless function or another server-only adapter for administrative submission calls. Store the Wix API key only as a protected Netlify server/build environment variable; never prefix it PUBLIC_ and never include it in Astro client code or static output.
D. For CRM contacts, query by email or rely on the API’s duplicate protection. Keep allowDuplicates false. Preserve marketing-consent context; do not silently subscribe contacts to marketing.
E. Do not import historical Netlify submissions because no approved export is present.

STAGE 8 — FRONTEND INTEGRATION
A. Implement a typed Wix data adapter behind the current presentation view models. For the six public-read collections, use `@wix/sdk` with the public Headless client and `OAuthStrategy`; do not use the administrator API key for public content reads. Pre-render the CMS content during the Netlify build for SEO and visual stability, retain local JSON only as an explicit development/emergency fallback, and create `docs/wix-cms-publishing.md` explaining that an approved Netlify rebuild is required after CMS edits unless a separately reviewed webhook/build-hook automation is later added.
B. Use visitor OAuth for public reads and visitor/member flows. Persist tokens appropriately only where browser sessions require them. Do not create a client secret for browser OAuth and never expose the administrator API key to the browser.
C. Preserve all current public paths, components, CSS tokens, fonts, images/video behavior, structured data, canonical logic, sitemap, robots, analytics event names, accessibility, keyboard interactions, and responsive breakpoints.
D. Keep Bsport links/widgets unchanged unless they are broken; do not migrate to Wix Bookings.
E. Replace Netlify Forms attributes only after the Wix submission path is implemented and tested. Archive or disable Decap `/admin/` production output after Wix CMS is proven as the source of truth, but preserve its source and configuration history in Git. Do not request or use administrator-login credentials; repository content and the authenticated protected preview are the migration evidence.
F. Add focused tests for Wix adapter mapping, fixture fallback, no-secret bundling, form submission behavior with safe mocks, collection counts, and sourceHash reconciliation.

STAGE 9 — PREVIEW DEPLOYMENT AND COMPLETE VALIDATION
A. Build and run the full repository test suite: npm run build and npm test. Install missing Playwright browsers only through the repository’s documented test:install command.
B. Run the explicit Bsport integrity check after the build:
   node tools/klub-cy-wix/scripts/validate-bsport.mjs --repo-root . --output .klub-wix-migration/validation/bsport.json --probe-cdn
   Confirm company `6604`, widget `868966`, the `/book/` fallback, compiled embed, and CDN. Then perform one real-browser booking-page smoke test with `navigator.webdriver` false and record whether the calendar mounts; do not submit a booking.
C. Run secret scans across tracked files, dist, Netlify function bundles, logs, and .klub-wix-migration receipts. Fail on any credential.
D. Deploy to a Netlify deploy preview or branch preview first. Do not deploy production unless KLUB_ALLOW_NETLIFY_PRODUCTION_DEPLOY=true.
E. Add the tested preview hostname to the Headless client and set the Wix Frontend Link to that preview.
F. Compare source and integrated preview at the repository breakpoint matrix. Reuse authenticated Netlify storage state without exposing the password. Capture screenshots and classify discrepancies. Complete bounded fix/retest loops until no critical/high issue remains or truthfully report done_with_gaps.
G. Validate all 16 public routes, internal links, redirects, 404 behavior, assets, forms, Bsport CTAs, metadata, canonical tags, Open Graph, sitemap, robots, JSON-LD, axe checks, keyboard/focus behavior, responsive layouts, and analytics-consent behavior.
H. Confirm Wix read-back: six native collections, 65 records, exact hashes/counts, expected forms, expected OAuth app, no unintended business-data change.
I. If production deployment is enabled, link only the already verified KLUB Netlify site and deploy. Record deploy ID, URL, commit, build log, and rollback deploy. Keep site password protection until a separate go-live decision.

STAGE 10 — DOMAIN CUTOVER
A. If KLUB_ALLOW_DOMAIN_CUTOVER is false, do not change DNS or Wix domain assignments. Produce DOMAIN_CUTOVER_RUNBOOK.md with the exact current main domain, proposed Wix backend subdomain, current DNS snapshot, target Netlify DNS values, preserved mail records, Wix primary-domain change, unassignment sequence, hosted-pages-domain setting, TLS checks, redirects, verification, and rollback.
B. If KLUB_ALLOW_DOMAIN_CUTOVER is true, still stop once and display the exact before/after domain plan and ask me to confirm it. Do not perform a partial domain switch.
C. After confirmation, follow Wix’s required coordinated order: point the main domain to Netlify while preserving MX/SPF/DKIM/DMARC; connect and make the Wix backend subdomain primary; unassign the main/apex domain from Wix; configure canonical/path redirects; set the Wix pages domain; verify TLS and every hosted flow.
D. Monitor for 24–48 hours, then restore the recorded TTL and remove obsolete preview redirect entries.

FINAL OUTPUT
Create .klub-wix-migration/completion.json, MIGRATION_REPORT.md, and RECOVERY_PLAN.md. Report each stage as complete, complete-with-gaps, blocked, or not-authorized. Include exact counts, IDs that are not secret, hashes, test results, preview/deploy URLs, unresolved issues, rollback assets, and the next manual action. RECOVERY_PLAN.md must list each safeguard, how to invoke it, the state it affects, what it does not restore, and the exact API-read, route, DNS, TLS, form, and business-flow checks that prove recovery succeeded. Never claim production completion if the domain gate is pending.

Begin now. Read the workflow and target lock first, then prove the plugin and Wix MCP before changing code.
```
