---
name: wix-development-expert
description: Build, integrate, manage, troubleshoot, and migrate Wix sites and apps using Wix CLI, JavaScript/TypeScript SDK, REST APIs, Wix MCP, Wix-managed or self-managed Headless, Wix CMS, business solutions, and official Wix Skills. Use for Wix API or MCP work, Claude Code Wix connector tasks, Wix app/extension development, Wix AI and credit questions, or converting an existing website such as an Astro/React/WordPress project to Wix.
---

# Wix Development Expert

Operate as a schema-first Wix engineer and migration supervisor. Prefer official live Wix documentation, method schemas, Wix-owned repositories, and the connected Wix MCP over memory. Preserve one authoritative project state, one pinned Wix destination, explicit approval gates, and reproducible validation evidence.

## Start Here

Classify the request before loading references or taking action.

| Request | Read first | Then read |
|---|---|---|
| Choose architecture | `references/Reference_Wix_01_Wix_Platform_Architecture_and_Development_Path_Decision_Guide.md` | Headless, apps, design, or migration reference |
| Write REST or SDK code | `references/Reference_Wix_02_Unified_Wix_API_Reference.md` | Authentication plus domain reference |
| Configure auth or permissions | `references/Reference_Wix_03_Wix_Authentication_Authorization_and_Security_Reference.md` | MCP reference if using connector tools |
| Develop with Wix CLI | `references/Reference_Wix_04_Wix_CLI_and_Code_First_Wix_Site_Development.md` | Headless or app reference |
| Build Wix Headless | `references/Reference_Wix_05_Wix_Headless_Architecture_Integration.md` | CMS/data and design references |
| Build an app, extension, plugin, or Blocks solution | `references/Reference_Wix_06_Wix_App_Development_Comprehensive_Reference.md` | Authentication and unified API references |
| Use Wix MCP or Claude Code plugin | `references/Reference_Wix_07_Wix_MCP_Claude_Code_and_Official_Wix_Skills.md` | Target domain reference and `references/Tool_Routing.md` |
| Work with AI tools or AI credits | `references/Reference_Wix_08_Wix_AI_Platform_and_Agent_Facing_Capabilities.md` | Recheck live prices, limits, and previews |
| Use CMS, Data, Media, Forms, CRM, or Members | `references/Reference_Wix_09_Wix_Development_CMS_Data_Media_Forms_CRM_Members_and_Migrations.md` | API and authentication references |
| Use Stores, eCommerce, Bookings, Blog, Events, Payments, or account APIs | `references/Reference_Wix_10_Wix_Business_and_Account_APIs_Reference_Guide.md` | API and authentication references |
| Rebuild site design, SEO, responsiveness, or accessibility | `references/Reference_Wix_11_Wix_Design_and_Site_Implementation.md` | Headless or CLI reference |
| Convert an existing website | `references/Reference_Wix_12_Existing_Site_to_Wix_Migration_and_Replatforming.md` | Migration playbook, project blueprint, and `templates/official-wix-replatform/` |
| Convert KLUB | `references/Strategy_KLUB_to_Wix_Implementation_Blueprint.md` | `templates/klub-case-study/`, `templates/examples/migration/`, and selected official replatform resources |

Do not load all references by default. Search large references by concept or exact method name.

## Source Hierarchy

Use this order when sources conflict:

1. Retrieve the current Wix method schema or live official product documentation.
2. Inspect current Wix-owned repositories, templates, and installed official Wix Skills.
3. Use the bundled corpus for decisions, workflows, and retrieval.
4. Use community material only as supplemental evidence and verify it against official sources.

Treat MCP tool names, Wix AI credit costs, quotas, package versions, previews, deprecations, and CLI commands as date-sensitive.

## Select the Development Path

Choose deliberately:

| Path | Use when | Default rule |
|---|---|---|
| Wix-managed Headless | Code-first frontend, high visual fidelity, Wix-managed hosting, Astro/SDK integration | Prefer for migrating existing coded websites into Wix |
| Self-managed Headless | Existing Wix editor site must keep the same dashboard/data while an externally hosted frontend replaces its public pages, or custom infrastructure is mandatory | Use Wix's documented same-project self-managed migration; do not infer an in-place conversion to Wix-managed Headless |
| Native Wix Studio/site | Visual-editor ownership is primary and manual reconstruction is acceptable | Do not promise lossless automated HTML/CSS import |
| Wix app/extension/Blocks | Reusable functionality should install into one or more Wix sites | Follow app lifecycle, permissions, and extension contracts |
| REST/SDK integration | Another system must read or change Wix data without replacing the frontend | Select auth and scope before code generation |

## Schema-First API Workflow

Follow this sequence for every Wix API or SDK implementation:

1. Identify the exact Wix product, service, and operation.
2. Determine context: account, site, app, dashboard, editor, managed Headless, self-managed Headless, visitor, member, admin, or backend.
3. Determine whether REST, SDK, CLI, MCP, editor action, or custom code is the correct interface.
4. Search the matching live documentation family.
5. Retrieve the full current method schema, including request, response, pagination, permissions, errors, version, and preview status.
6. Resolve account/site context and required installed apps.
7. Generate the smallest typed example using environment variables for credentials.
8. Validate types and request data locally.
9. For reads, execute and report scope, count, paging state, and source.
10. For writes, present a dry-run plan and stop for approval unless a durable one-click policy explicitly authorizes the operation.
11. Execute idempotently where possible and read back the changed state.
12. Persist IDs, crosswalks, failures, and recovery instructions.

Never generate a method call from a search-summary snippet. Never guess field names or permissions. Never place API keys, app secrets, or client secrets in browser code.

## Wix MCP Workflow

Use `WixREADME` or the current routing/readme tool first for Wix management requests. Use documentation search tools for SDK, REST, Headless, app, build-app, or Wix Design System research. Retrieve full articles for concepts and full method schemas before a request.

Resolve the Wix site before site-scoped operations. Use site API tools for business data and account-level site-management tools for site creation, update, publication, or other account operations. Use media upload tools only after confirming target site, file count, deduplication rule, and downstream record dependencies.

Before a write, show:

| Required item | Meaning |
|---|---|
| Target | Account ID, site ID/name, and environment |
| Operation | Exact method/tool and API version |
| Impact | Entity count and fields affected |
| Prerequisites | Permissions, installed apps, schemas, media, and relations |
| Idempotency | Source identity, upsert rule, and crosswalk location |
| Validation | Read-back and rendered/business checks |
| Rollback | Reversible operation or documented limitation |

Ask for explicit confirmation before site creation, publication, bulk data writes, destructive actions, domain/DNS changes, payment or billing actions, or any operation with material side effects.

## Authentication Rules

Select authentication by context rather than convenience.

| Context | Typical strategy |
|---|---|
| Visitor or member in self-managed Headless | `OAuthStrategy` with client ID and securely persisted tokens |
| Trusted admin backend for site-level calls | `ApiKeyStrategy` with API key and site ID |
| Trusted admin backend for account-level calls | `ApiKeyStrategy` with API key and account ID |
| Wix app backend | App strategy and instance context according to current docs |
| Dashboard/editor/site extension | Host-provided auth and host context |
| Wix-managed Headless server/page | Managed integration/module pattern where supported |

Keep secrets outside repositories. Validate webhook or app requests. Elevate only the narrow backend operation that requires it and validate all user-controlled input first.

## Existing-Site Migration Workflow

When the pinned destination is an existing Classic Editor or Studio site and the requirement is to preserve that site's dashboard, plan, domain context, and business data, route to **self-managed Headless**: build and test the external frontend first, configure a Headless OAuth client, preserve the editor site until preview approval, then perform Wix's coordinated main-domain/external-host and Wix-subdomain switch. Keep Wix-managed Headless as the default only when a new managed code project is acceptable. Never guess that an editor site converts in place to a managed project.

For protected source deployments, do not use password-gated asset URLs with Media Manager `Import File`; use local binary upload through Generate File Upload URL and the signed `PUT` workflow, verify readiness, and persist a hash crosswalk. Treat site duplication, CMS backup, source control, external-host deployment history, and DNS rollback as complementary safeguards.

Treat migrations as resumable, artifact-driven programs.

```text
intake → destination → source inputs → preflight → discovery → mapping
→ setup discovery → execution approval → setup → media/data import
→ frontend build → test and visual gap loop → preview approval → release
→ aggregate completion
```

### Preserve These Invariants

- Resolve one active project directory and one pinned destination.
- Use browser-backed evidence and repository analysis; do not substitute HTML-only extraction.
- Freeze source inventory and build plans with hashes.
- Map every route, content type, data entity, asset, form, integration, SEO rule, and business workflow.
- Complete read-only discovery, mapping, dry-run code generation, and validation before writes.
- Upsert by stable source identity and persist source-to-Wix crosswalks.
- Import dependencies before dependents.
- Do not declare completion from a successful build or API response.
- Require route, link, asset, accessibility, SEO, structured-data, form, business-flow, and visual-parity evidence.
- Preserve rollback until post-cutover checks pass.

Read `references/Strategy_Existing_Website_to_Wix_Migration_Playbook.md` for the complete reusable workflow. For KLUB, read `references/Strategy_KLUB_to_Wix_Implementation_Blueprint.md` and run the read-only transformer in `templates/examples/migration/` before generating Wix write code. For Wix’s official replatform machinery, inspect `templates/official-wix-replatform/SOURCE.json`, its `LICENSE`, and the relevant local skill/script before use.

Treat the official replatform utilities as version-pinned reference implementations, not universal one-command migration tools. Confirm each script’s inputs and side effects: `extract-assets.mjs` discovers/downloads source assets rather than uploading to Wix; `visual-qa.mjs` is a frozen-spec heuristic preflight that still requires browser-backed result comparison; and `provision-repeater-cms.mjs` targets its generated generic repeater schema, not the approved KLUB collections.

## Code and Template Library

Use the bundled examples as tested starting points:

| Path | Purpose |
|---|---|
| `templates/examples/mcp/` | Remote MCP and API-key connector configuration plus routing guide |
| `templates/examples/sdk/` | Compile-checked OAuth, API-key, and managed-Headless CMS TypeScript |
| `templates/examples/rest/` | Compile-checked scope-safe REST wrapper and pagination helper |
| `templates/examples/migration/` | KLUB route/schema/execution manifests and read-only payload transformer |
| `templates/examples/ci/` | Protected Wix-managed Headless validation workflow without automatic release |
| `templates/examples/prompts/` | Schema-first Claude Code and Wix MCP prompt patterns |
| `templates/official-wix-replatform/` | Version-pinned official Wix replatform skills, scripts, schemas, tests, license, and provenance |
| `templates/klub-case-study/` | Detailed KLUB architecture, route, CMS, forms/bookings, design, execution, analyzer, and structured evidence |

Adapt examples and official resource scripts only after confirming the current packages and method schemas. Run `scripts/validate_examples.py` after copying or modifying the example library.

## Validation Gates

For code, run formatting, type checks, unit tests, build, and targeted runtime tests. For sites, validate the agreed breakpoints, first-viewport identity, responsive navigation, keyboard paths, focus, motion controls, image crops, forms, booking/checkout flows, analytics consent, canonical URLs, redirects, metadata, structured data, sitemap, robots, internal links, and error pages.

For a migration, classify gaps as critical, high, medium, or low. Continue a bounded fix loop for owned gaps. Record a blocker only after targeted recovery attempts fail or external authority is genuinely required.

## Completion Rule

Declare success only when the selected deliverable has current validation evidence. An integrated migration requires reconciled business/data import, frontend release evidence, one shared destination, no unresolved critical/high gaps, approved preview, and documented rollback/completion state.

## Failure Recovery

Classify failures before retrying: authentication, permission, wrong account/site scope, missing app, invalid schema, pagination/rate limit, CLI environment, stale artifact, source acquisition, or Wix service failure. Preserve state. Attempt at most two distinct targeted recoveries. If still blocked, record the exact evidence, owner, and unblock action instead of silently stopping or starting over.
