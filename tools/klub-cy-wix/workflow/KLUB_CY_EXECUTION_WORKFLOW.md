# KLUB-CY Claude Code Migration Execution Workflow

**Author:** Manus AI  
**Pinned Wix account:** `8372deba-8664-4ad5-8212-6c10a7f348b1`  
**Pinned Wix site:** `KLUB-CY` / `20f11f6f-6ce3-469d-b44c-df397c750848`  
**Pinned KLUB commit:** `15ec3d93f187f5ec12bee14e8bd7b11692220002`

## 1. Supported Architecture

The existing KLUB-CY destination is a Premium Classic Editor site. Wix’s supported route for replacing the frontend of an existing editor-built site while keeping its dashboard and business data is **self-managed Headless**. The Astro frontend remains on Netlify, and Wix becomes the existing-site backend for CMS, CRM, Forms, members, and any approved business solutions. Wix-managed Headless is a separate project type and must not be inferred as an in-place conversion of this site.[1] [2]

> The package must never create a second production destination, overwrite another Wix site, or attempt to convert KLUB-CY into a Wix-managed Astro project. It must bind the existing externally hosted frontend to the pinned KLUB-CY backend.

The live editor site continues serving its attached domain throughout preflight, provisioning, content migration, frontend integration, and preview testing. Only the coordinated domain switch changes what visitors see.[2]

## 2. Immutable Target and Source Locks

| Lock | Required value | Failure behavior |
|---|---|---|
| Wix account ID | `8372deba-8664-4ad5-8212-6c10a7f348b1` | Stop before any write |
| Wix site ID | `20f11f6f-6ce3-469d-b44c-df397c750848` | Stop before any write |
| Wix display name | `KLUB-CY` | Stop and require investigation |
| Source repository | `https://github.com/ma4kos/KLUB` | Stop if another repository is open |
| Source commit | `15ec3d93f187f5ec12bee14e8bd7b11692220002` | Re-run inventory and require a documented source-change decision |
| Source preview | `https://klub-cy.netlify.app/` | Stop visual comparison if unavailable |
| Architecture | `SELF_MANAGED_HEADLESS_EXISTING_WIX_SITE` | Reject managed-project or new-site plans |

The current verified source contains 14 Astro route files, 10 shared components, five JSON content models, 87 public assets, and 179 migration-relevant files. A fresh `npm ci`, production build, and focused Playwright suite passed with 193 tests and five skips. The complete test suite must pass again before cutover.

## 3. Operation Gates

The local environment file separates data/backend changes, production deployment, and domain cutover. These are independent authorizations.

| Environment flag | Scope | Default |
|---|---|---|
| `KLUB_ALLOW_WIX_WRITES` | Create backup, Headless OAuth app, native CMS collections/items, forms, and approved Wix configuration on the pinned site | `false` |
| `KLUB_ALLOW_NETLIFY_PRODUCTION_DEPLOY` | Deploy the integrated frontend to the linked Netlify production site | `false` |
| `KLUB_ALLOW_DOMAIN_CUTOVER` | Change DNS, primary domain, assignments, or Wix pages domain | `false` |
| `KLUB_ALLOW_CMS_RESTORE` | Restore a Wix CMS backup | Always `false` in this package |
| `KLUB_ALLOW_DELETE_EXISTING_BUSINESS_DATA` | Remove pre-existing business records | Always `false` in this package |

The one-shot workflow may complete every read-only task in one session. It may execute Wix writes only if `KLUB_ALLOW_WIX_WRITES=true`, the target lock matches, and the preflight contains no blocker. It must stop before production deploy or domain cutover unless the corresponding independent flag is already true.

## 4. Stage A — Local and Connector Preflight

Claude Code must verify that the repository working tree is understood before editing. It should create a dedicated migration branch, preserve any existing uncommitted work, and never reset, discard, or overwrite user changes.

The plugin is loaded from `tools/klub-cy-wix/plugin/claude-code-wix-development`. The Wix MCP must be authenticated and its operating guide read first. Claude then resolves `KLUB-CY` through the site-list tool and retrieves the exact site context. The local `scripts/preflight.py` independently verifies the same destination through read-only REST calls and persists a sanitized state record.

Required read checks are Query Sites, List Data Collections, List Backups, Query OAuth Apps, and Query Forms. The domain check is also attempted. The supplied API key passed the required read checks but did not include `DOMAINS.READ_CONNECTED_DOMAINS`; therefore `WIX_MAIN_DOMAIN` must be entered manually or that permission must be added before a domain operation.

## 5. Stage B — Durable Baseline and Safeguards

Create `.klub-wix-migration/` and treat its JSON artifacts as the migration’s durable memory. At minimum it must contain:

| Artifact | Purpose |
|---|---|
| `intake.json` | Source, destination, architecture, delivery mode |
| `destination.json` | Pinned Wix target and current site state |
| `preflight.json` | Sanitized read checks, scopes, and blockers |
| `source-inventory.json` | Routes, records, assets, forms, tests, hashes |
| `mapping.json` | Source-to-Wix entity and stable ID mapping |
| `execution-plan.json` | Ordered exact methods, request-body files, validation, rollback |
| `crosswalks/` | Source IDs/hashes to Wix IDs/URLs |
| `validation/` | Build, test, link, accessibility, SEO, visual, API read-back evidence |
| `receipts/` | Successful Wix writes and deployment receipts without credentials |
| `completion.json` | Aggregate status and unresolved gaps |

If enabled, create a duplicate of KLUB-CY with `POST https://www.wixapis.com/site-actions/v1/sites/duplicate`, using `sourceSiteId` and a timestamped `siteDisplayName`. A duplicate is a design/configuration safeguard only: Wix does not copy store orders, contacts, invoices, custom-domain assignment, Premium capabilities, or all third-party application settings.[3]

Create an on-demand CMS backup before native CMS writes, then poll List Backups until the new backup is complete. Do not call Restore Backup automatically. Wix CMS backups are not a substitute for source control, Netlify deployment history, domain rollback, or a Wix site duplicate.[4]

## 6. Stage C — Headless Client

Query existing OAuth apps. If an appropriate KLUB client exists, retrieve its full object and merge changes rather than replacing unmentioned fields. If no app exists and provisioning is enabled, create one with the exact current schema from `references/live-schemas/Wix_OAuth_App_Live_Schemas.json`.

The recommended initial app values are:

| Field | Initial value |
|---|---|
| `name` | `KLUB-CY Netlify Frontend` |
| `applicationType` | `WEB_APP` |
| `technology` | `OTHER_TECHNOLOGY` |
| `allowedRedirectDomains` | `klub-cy.netlify.app` plus the manually confirmed production hostnames |
| `allowedRedirectUris` | Add only real callback routes implemented by the frontend |
| `loginUrl` | Leave empty unless the frontend implements a custom login page |
| Secret generation | Disabled for browser visitor/member OAuth |

The public Headless client ID is safe to expose in the frontend. The administrative API key is not. Use `@wix/sdk` with `OAuthStrategy` for browser-side visitor/member sessions and token persistence. Administrative CMS migration requests remain server-only.[5]

## 7. Stage D — KLUB Content Plan

Run `scripts/build-klub-payloads.mjs` against the current repository, then run `scripts/generate_wix_plan.py`. These commands make no Wix calls. They must produce six native collection plans with deterministic UUIDv5 item IDs:

| Wix collection | Expected records | Source |
|---|---:|---|
| `KlubClasses` | 4 | `src/content/classes.json` |
| `KlubFaqSections` | 6 | `src/content/faq.json` |
| `KlubFaqItems` | 38 | `src/content/faq.json` |
| `KlubPricingGroups` | 4 | `src/content/pricing.json` |
| `KlubPricingItems` | 12 | `src/content/pricing.json` |
| `KlubSiteSettings` | 1 | `src/content/studio.json` |

Never modify or delete the 15 verified `WIX_APP` collections. Create a planned native collection only when its exact ID is absent. If it already exists, compare its field schema and stop on an incompatible change rather than recreating it.

Bulk Save Data Items completely replaces an item when the supplied ID already exists. The planner therefore emits complete records and stable UUIDv5 IDs. After every batch, query the collection through `POST https://www.wixapis.com/data/v2/items/query`, compare ID, `sourceId`, `sourceHash`, and expected count, and persist a reconciliation receipt.[6] [7]

## 8. Stage E — Media

Do not ask Wix to import the password-protected Netlify URLs. Generate an upload URL for each approved local source asset using `POST https://www.wixapis.com/site-media/v1/files/generate-upload-url`, then upload the binary with `PUT` to the returned signed URL. Verify readiness and persist a crosswalk from source path/hash to Wix file ID and URL.[8]

Start with media referenced by CMS records. Retain implementation-only fonts, Netlify/Decap administration assets, and static presentation assets in the Astro build unless moving them provides a defined editorial benefit. Replacing all 87 public assets is not required for a valid self-managed Headless architecture.

## 9. Stage F — Forms and CRM

KLUB has two source workflows: a contact form and a founding-member form. Query Wix Forms first. The site currently has the Wix Forms application but zero form schemas. If form migration is enabled, create two forms only from a freshly retrieved current schema.

| Form | Required behavior |
|---|---|
| Contact | Name, email, optional phone, required message, privacy link, accessible success state, recoverable errors |
| Founding member | Source page, name or compact empty name, email, optional phone, interest option, explicit privacy/marketing consent, accessible in-place success state |

Prefer Wix Forms submissions when the current form schema can preserve all fields and consent metadata. If not, create a server-side endpoint that calls Wix Forms or CRM. CRM Contact creation must keep duplicate creation disabled; use email-based read-before-create and preserve consent provenance. Do not migrate old Netlify submissions unless an explicit export is supplied and separately approved.[9] [10]

## 10. Stage G — Frontend Integration

Add Wix adapters behind the current Astro presentation interfaces. Use the public Headless client with `OAuthStrategy` for the six public-read native collections; never use the administrator API key in browser-delivered code. Pre-render Wix CMS content during the Netlify build for SEO and visual stability, preserve local JSON only as an explicit development/emergency fallback, and document that a CMS edit requires an approved Netlify rebuild unless a separately reviewed webhook/build-hook workflow is later added. The initial integration should keep Bsport as the booking system because the source has Bsport company and widget IDs but no confirmed Wix Bookings migration authorization.

Preserve the current routes, typography, visual identity, structured data, sitemap, robots behavior, analytics event names, accessibility behavior, and responsive rules. Do not include the Wix API key in browser code or Netlify public environment variables.

Deploy to a Netlify deploy-preview or branch URL first. Add that hostname to the Headless client’s allowed domains. If member login is implemented, add only the exact callback URI that exists in source and tests. Set the Wix Frontend Link to the tested preview URL.

## 11. Stage H — Acceptance Tests

Run the production build and full Playwright suite. Compare the protected source deployment and integrated preview at the tested widths. A valid preview requires:

| Gate | Acceptance |
|---|---|
| Build | `npm run build` succeeds |
| Regression | Complete `npm test` succeeds, with skips explained |
| URLs | All 16 public routes preserve their path or have an approved redirect |
| CMS | 65 planned records reconcile by deterministic ID and source hash |
| Forms | Both workflows create the intended Wix state and preserve consent/success behavior |
| Media | Every migrated media reference resolves and renders correctly |
| SEO | Titles, descriptions, canonical behavior, Open Graph, sitemap, robots, JSON-LD pass |
| Accessibility | Existing axe, keyboard, focus, status, contrast, and motion tests pass |
| Visual | No unresolved critical/high gap at the repository’s breakpoint set |
| Secrets | No API key, password, token, or administrator credential is present in Git, build output, browser bundle, or logs |

## 12. Stage I — Domain Cutover

Domain cutover is deliberately separate. Wix requires a coordinated external-host and Wix-domain sequence.[2]

Twenty-four to forty-eight hours before launch, record the current DNS state and lower the main record’s TTL to 300 seconds. Add all final production hostnames and real callback URIs to the Headless client. Set the Frontend Link to the production frontend.

At launch, point the main domain’s `CNAME` or `A` record to Netlify while leaving `MX`, `SPF`, `DKIM`, and `DMARC` unchanged. Then connect a planned Wix subdomain such as `checkout.<main-domain>` to KLUB-CY, make it the project’s primary domain, and unassign the main domain from Wix. Configure canonical and changed-path redirects at Netlify. Set the Wix pages domain to the Wix subdomain so Wix-hosted flows remain branded.

This package does not automate domain cutover unless `KLUB_ALLOW_DOMAIN_CUTOVER=true`; even then, Claude must print the exact DNS before/after plan and require a final explicit confirmation in the live session because DNS and domain assignment are externally visible and time-sensitive.

## 13. Rollback

Before cutover, rollback means disabling the integrated preview and leaving the live editor site untouched. After cutover, the primary rollback is to restore the previous DNS records and reassign the original main domain to the Wix editor site. Preserve the old site, source repository, Netlify deploy history, DNS snapshot, site duplicate if created, CMS backup, and all request receipts until the observation window closes.

Do not use CMS Restore as a general rollback. It affects CMS state only and is explicitly disabled in this package. After any rollback, re-run domain, TLS, email DNS, hosted-page, form, booking-link, route, and SEO checks.

## 14. Completion Rule

Completion requires one pinned Wix backend, one approved Netlify production frontend, reconciled Wix records, passing regression/visual/SEO/accessibility/form checks, a deployment receipt, a domain/DNS receipt if cutover occurred, and no unresolved critical/high gap. If the domain gate remains false, the truthful result is **preview migration complete; cutover pending**, not production complete.

## References

[1]: https://dev.wix.com/docs/go-headless/self-managed-headless/get-started/migrate-from-an-existing-wix-site/about-wix-site-migration-to-a-headless-project "About Wix Site Migration to a Self-Managed Headless Project"
[2]: https://dev.wix.com/docs/go-headless/self-managed-headless/get-started/migrate-from-an-existing-wix-site/migrate-a-wix-site-to-a-headless-project "Migrate a Wix Site to a Self-Managed Headless Project"
[3]: https://dev.wix.com/docs/api-reference/account-level/sites/site-actions/duplicate-site "Duplicate Site"
[4]: https://dev.wix.com/docs/api-reference/business-solutions/cms/operations/backups/create-backup "Create Backup"
[5]: https://dev.wix.com/docs/go-headless/authentication/setup/create-an-sdk-client-with-oauth "Create an SDK Client with OAuth"
[6]: https://dev.wix.com/docs/api-reference/business-solutions/cms/data-items/bulk-save-data-items "Bulk Save Data Items"
[7]: https://dev.wix.com/docs/api-reference/business-solutions/cms/data-items/query-data-items "Query Data Items"
[8]: https://dev.wix.com/docs/api-reference/assets/media/media-manager/files/generate-file-upload-url "Generate File Upload URL"
[9]: https://dev.wix.com/docs/api-reference/crm/forms/form-schemas/create-form "Create Form"
[10]: https://dev.wix.com/docs/api-reference/crm/members-contacts/contacts/contacts/contact-v4/create-contact "Create Contact"
