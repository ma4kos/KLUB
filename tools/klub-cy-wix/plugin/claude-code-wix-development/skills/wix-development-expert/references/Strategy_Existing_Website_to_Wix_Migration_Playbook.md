# Existing Website to Wix Migration Playbook

**Author:** Manus AI  
**Audience:** Claude Code agents, Manus agents, and senior developers  
**Primary use:** Rebuild an existing public website on Wix while preserving identity, data, URLs, business workflows, and measurable quality

## 1. Operating Principle

A website migration is not a page-copy exercise. It is a controlled transfer of **frontend identity**, **content and business data**, **behavior**, **URLs and SEO state**, **operational ownership**, and **testable quality** into an appropriate Wix architecture. Wix’s own replatform supervisor encodes this as a resumable pipeline with authoritative artifacts, idempotent writes, source-identity deduplication, approval gates, and aggregate completion evidence rather than chat history or a single completion claim.[1]

> Treat validated artifacts as the migration’s memory. Treat chat, logs, screenshots, and generated code as evidence or diagnostics—not as authority for resuming or declaring completion.

## 2. Choose the Correct Wix Destination

The first architectural decision determines what can be automated, how much fidelity can be preserved, and who owns the resulting code.

| Destination | Select when | Strengths | Constraints |
|---|---|---|---|
| **Wix-managed Headless** | The source is already a code-first frontend, high visual fidelity matters, and the goal is to move hosting plus business services into Wix | Preserves the existing frontend mental model; uses Wix CLI, Astro, SDK, CMS, media, and business solutions; Wix manages build, release, hosting, scaling, and security | Requires code ownership; not every Wix editor-native behavior maps directly; account/site access is required for real scaffolding and writes |
| **Native Wix Studio site** | Non-developer visual editing is the dominant requirement and controlled manual rebuilding is acceptable | Strong editor ownership, responsive design tools, native Wix widgets, page editing, and business-solution integration | Pixel-precise migration is less automatable; arbitrary source HTML/CSS/JS cannot be losslessly imported; final work often requires editor actions and manual QA |
| **Self-managed Headless** | An existing Wix site should remain the backend while the frontend stays on external hosting, or an unsupported framework/hosting requirement is mandatory | Maximum framework and infrastructure control; retains an existing Wix backend | Developer owns hosting, authentication, deployment, security, SEO implementation, and runtime operations |
| **Wix app/extension** | The source is functionality to install across Wix sites rather than a standalone brand website | Reusable dashboard, site, editor, and backend extensions | Not a direct replacement for an ordinary standalone website |

Wix documents managed and self-managed Headless as separate development paths. Managed Headless is the natural default for a code-first migration into Wix; self-managed Headless is the natural choice when an existing Wix backend is retained behind an externally hosted frontend.[2] [3]

## 3. Mandatory Migration State Model

Create one project directory per migration and preserve it for the entire run. Do not create a second destination because a later stage lost context. The official Wix migration supervisor requires the active project and its validated artifacts to be the resume authority, routes to one stage at a time, and forbids parallel replacement artifacts.[1]

A durable project should contain the following logical records, even if filenames differ:

| Artifact | Purpose | Completion rule |
|---|---|---|
| `intake.json` | Source, destination, delivery mode, automation mode, ownership, exclusions | Required values resolved and provenance recorded |
| `source-inventory.json` | Routes, assets, content types, data models, integrations, forms, SEO, interactions, tests | Reproducible extraction with hashes and source paths |
| `destination.json` | Wix account/site/project identity and whether it was created or adopted | Exactly one pinned destination |
| `preflight.json` | Toolchain, access, permissions, source availability, rate/size limits, blockers | All mandatory checks passed or typed blocker persisted |
| `mapping.json` | Source-to-Wix entity, route, behavior, and ownership mapping | Reviewed and approved before writes |
| `execution-plan.json` | Ordered read/write operations, dependencies, retries, rollback, approvals | Validated and explicitly approved |
| `crosswalks/` | Source IDs to Wix IDs for media, CMS records, contacts, products, posts, and other imported entities | Idempotent, append-safe, and reused on resume |
| `frontend-plan.json` | Route structure, component plan, design tokens, interactions, SEO, content bindings | Frozen against a specific source inventory hash |
| `validation/` | Builds, tests, screenshots, API verification, link checks, structured-data results | Required gates pass or terminal gaps are truthfully classified |
| `completion.json` | Aggregate backend and frontend status, release evidence, unresolved gaps | Produced only by the final completion gate |

## 4. End-to-End Pipeline

Wix’s current replatform pipeline separates intake, destination selection, source acquisition, preflight, discovery, mapping, code generation, setup discovery, website handoff, safety approval, setup, import, frontend continuation, and aggregate finalization.[1] Adapt that model to all source platforms as follows.

### Phase A: Intake and Destination Pinning

Resolve the source URL or repository, intended delivery mode, migration scope, destination ownership, account/site, business features, and release constraints. Classify the delivery mode as **frontend only**, **backend/business data only**, or **integrated frontend plus business data**. Pin exactly one destination once approved.

Do not ask for credentials that are not yet needed. Never print secrets. Record only whether a required key or token is present, blank, missing, or invalid.

### Phase B: Read-Only Source Discovery

Capture the source through both repository analysis and browser-backed evidence. The official Wix Headless replatform workflow makes browser-backed extraction mandatory because HTML-only acquisition cannot reliably capture responsive layout, interactions, lazy assets, rendered content, or first-viewport identity.[4]

Discovery should produce:

| Domain | Evidence to collect |
|---|---|
| Routes | Canonical URLs, dynamic patterns, pagination, locale variants, parameterized pages, redirects, 404 behavior |
| Content | Page copy, structured records, editorial ownership, schemas, source IDs, timestamps, slugs |
| Visual system | Colors, fonts, spacing, breakpoints, grids, reusable components, image crops, motion, first-viewport hierarchy |
| Assets | Original URL/path, MIME type, dimensions, size, hash, alt text, usage locations, licensing/ownership |
| Interactions | Menus, forms, filters, carousels, video controls, hover/focus behavior, client state, external widgets |
| Business workflows | Commerce, booking, membership, CRM, forms, notifications, coupons, events, blog, payments |
| SEO | Titles, descriptions, canonical URLs, Open Graph/Twitter tags, schema markup, sitemap, robots, internal links |
| Quality contracts | Existing tests, accessibility criteria, performance budgets, link integrity, analytics events, visual baselines |

Freeze discovery against a manifest hash. Builders consume the frozen manifest, not raw observations.[4]

### Phase C: Wix Capability Mapping

Map each source entity to one explicit Wix target and justify the choice. Common targets include Wix CMS collections, dynamic pages or code routes, Wix Media Manager, Wix Forms and CRM, Wix Bookings, Stores/eCommerce, Blog, Events, Pricing Plans, Members, SEO APIs/settings, and custom frontend components.

Use exact current Wix documentation and method schemas. The Wix MCP is designed to search SDK/REST/Headless/app/design documentation, retrieve full articles and method schemas, list sites, resolve site context, execute site-scoped API calls, manage account-level site operations, and upload media.[5] Documentation-search output is not itself permission to write.

A mapping record should include:

| Field | Requirement |
|---|---|
| `sourceType` and `sourceId` | Stable source identity used for deduplication |
| `sourcePath` or URL | Auditable origin |
| `wixTarget` | Exact Wix product, collection, entity, route, or component |
| `wixScope` | Account, site, project, frontend, backend, visitor, member, or admin |
| `operationInterface` | CLI, SDK, REST, MCP, editor action, or retained custom code |
| `prerequisites` | Apps, permissions, authentication, collection, media, or dependent records |
| `writeSemantics` | Create, update, upsert, link, publish, install, upload, or manual configure |
| `crosswalkKey` | Source-to-Wix identity field |
| `validation` | Read-back or rendered acceptance test |
| `rollback` | Delete, restore, unpublish, DNS reversal, or retained source system |

### Phase D: Mapping Review and Execution Approval

Complete read-only discovery, mapping, setup verification, code generation, and dry-run validation before writes. Wix’s migration supervisor preserves a mandatory execution-plan approval gate before setup or import.[1]

The approval packet should summarize counts, exclusions, destructive possibilities, uncertain mappings, required Wix apps, rate/limit risks, destination identity, and rollback. Approval must be durable state, not an ephemeral “yes” in chat.

### Phase E: Destination Setup

Create or adopt the Wix destination, install required business solutions, provision CMS collections and indexes, configure permissions, establish secrets, set redirect/allowed domains, and verify site context. Use account-level operations only for account/site management; use site-scoped operations for business data.[5]

Do not silently create a second site. In an integrated migration, pass the backend handoff into the frontend migration so both phases reuse the same destination.[1] [4]

### Phase F: Media and Data Import

Import dependencies before dependents. A typical order is media, taxonomy/categories, CMS records, contacts/members, products/services, inventory, pricing/coupons, posts/events, orders/bookings, relations, then frontend bindings.

Every write should be idempotent. Persist crosswalks immediately. On retry, resolve by source identity and update or skip rather than duplicate. Use bounded pagination, schema validation, rate-limit handling, and read-back verification. Separate permanent exclusions from temporary failures and recoverable retries.

### Phase G: Frontend Implementation

For Wix-managed Headless, scaffold a real Wix CLI project. Do not hand-create a directory that merely resembles one. The official Headless replatform workflow requires a successful Wix CLI scaffold with valid Wix identity and runnable development/build scripts.[4]

Implement from a frozen build plan that covers:

| Layer | Required outcome |
|---|---|
| Route shell | Source URL structure, navigation, error pages, locale handling |
| Shared chrome | Header, mobile navigation, footer, announcement/global bars, global actions |
| Design tokens | Colors, fonts, spacing, radii, shadows, motion, breakpoints |
| Content binding | Wix CMS and business-solution data replace local/mock data without changing presentation contracts |
| Interactive islands | React only where complex state justifies it; otherwise prefer Astro and small client scripts |
| SEO | Page metadata, canonical behavior, structured data, sitemap/robots expectations, redirect map |
| Accessibility | Keyboard paths, focus visibility, landmarks, labels, motion controls, contrast, media alternatives |
| Observability | Build/log visibility, analytics consent, migration diagnostics, release receipt |

### Phase H: Verification and Gap Loop

A successful build is not completion. Wix’s official frontend migration workflow requires post-build visual review and a bounded gap loop; in one-click mode it allows up to five visual gap cycles before a truthful `done_with_gaps` result.[4]

Compare source and destination at agreed breakpoints. Validate route status, internal links, assets, forms, business operations, SEO, structured data, keyboard behavior, accessibility scans, and existing regression tests. Classify each discrepancy by severity, evidence, owner, dependency closure, and resolution.

### Phase I: Preview, Release, and Rollback

Release only after the approved preview passes. Preserve the existing deployment until DNS and critical business workflows are verified. Record the Wix release identifier or receipt, destination URL, test evidence, mapping/crosswalk hashes, unresolved non-critical gaps, and rollback steps.

## 5. Claude Code and Wix MCP Operating Pattern

Install the official Wix plugin in Claude Code with the Wix marketplace and plugin commands documented by Wix. The plugin bundles Wix Skills and the Wix MCP, pairing procedural workflows with live documentation and API access.[6]

```text
/plugin marketplace add wix/skills
/plugin install wix@wix
```

Use this sequence for implementation tasks:

1. Invoke the relevant Wix skill for the workflow.
2. Call the Wix MCP routing/readme tool first when the task is a Wix management operation.
3. Search the correct documentation family: SDK, REST, Headless, app development, or Wix Design System.
4. Retrieve the full method schema before generating a request or write script.
5. Resolve the target account, site, and installed-app context.
6. Generate a dry-run plan with counts and validation rules.
7. Obtain the required write approval.
8. Execute site-scoped data operations with the site API execution tools and account-level site operations with the site-management tool.
9. Read back changed entities and run frontend/business validation.
10. Persist crosswalks, completion state, and recovery information in the project repository.

## 6. Security and Destructive-Action Rules

Use least privilege. Keep Wix API keys and client secrets outside repositories. Prefer OAuth for interactive account access and API keys only for suitable server-to-server/admin contexts. Separate visitor/member tokens from admin credentials. Never place administrative credentials in browser-delivered code.

Before any destructive, publishing, billing, domain, payment, or bulk write operation, present the exact action, target account/site, affected entity count, rollback ability, and unresolved risk. Require explicit approval unless the user has deliberately enabled an automation mode whose durable policy permits the action.

## 7. Completion Standard

Declare completion only when the selected delivery mode has all required evidence. Backend-only completion requires reconciled import accounting and verified crosswalks. Frontend-only completion requires release evidence and accepted visual/functional review. An integrated migration requires both, plus one shared destination, no unresolved critical/high gaps, and a valid aggregate completion artifact.[1]

## 8. Anti-Patterns

| Anti-pattern | Why it fails | Corrective rule |
|---|---|---|
| Copying visible text and images only | Loses data relationships, SEO, behaviors, operations, and quality contracts | Perform repository and browser-backed discovery |
| Generating API code from memory | Wix APIs, previews, deprecations, and schemas change | Retrieve current docs and exact method schemas |
| Creating a second Wix site mid-run | Fragments data, configuration, and release authority | Pin and reuse one destination |
| Re-running imports without crosswalks | Duplicates media, contacts, content, or products | Upsert by source identity and persist mappings |
| Treating an API response as frontend completion | Does not prove rendering, accessibility, URLs, or business behavior | Require post-build and end-to-end validation |
| Forcing all source content into CMS | Creates unnecessary editorial complexity | Use CMS only for repeated, relational, searchable, or frequently edited content |
| Forcing code-first designs into editor-native components | Can reduce fidelity and increase manual work | Select managed Headless when code identity is a primary requirement |
| Publishing before preview approval | Increases business, SEO, and data-loss risk | Preserve explicit approval and rollback gates |

## References

[1]: https://github.com/wix/skills/blob/main/wix-replatform/SKILL.md "Wix replatform supervisor"
[2]: https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless.md "About Wix-Managed Headless"
[3]: https://dev.wix.com/docs/go-headless/self-managed-headless/about-self-managed-headless.md "About Self-Managed Headless"
[4]: https://github.com/wix/skills/blob/main/wix-headless-replatform/SKILL.md "Wix Headless replatform skill"
[5]: https://dev.wix.com/docs/sdk/articles/use-the-wix-mcp/about-the-wix-mcp.md "About the Wix MCP"
[6]: https://dev.wix.com/docs/api-reference/articles/ai-tools/about-the-wix-plugin.md "About the Wix Plugin"
