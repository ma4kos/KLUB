# KLUB-CY Claude Code Wix Migration Kit

**Author:** Manus AI  
**Target:** Existing Wix site `KLUB-CY` (`20f11f6f-6ce3-469d-b44c-df397c750848`)  
**Source:** [`ma4kos/KLUB`](https://github.com/ma4kos/KLUB) at `15ec3d93f187f5ec12bee14e8bd7b11692220002`

This package installs the validated **Claude Code Wix Development Plugin** into a local session and gives Claude one authoritative, resumable prompt for evaluating and migrating KLUB. It uses the supported **self-managed Headless** path: the Astro frontend remains externally hosted on Netlify while the existing KLUB-CY Wix site becomes the backend and dashboard.[1]

## Quick Start

1. Read `MANUAL_STEPS_BEFORE_RUNNING.md`.
2. Extract this folder as `tools/klub-cy-wix` inside the local KLUB repository.
3. Copy `config/.env.klub-cy.example` to `.env.klub-cy.local` and fill it without committing it.
4. Store the Wix API key at `.secrets/WixAPIKey.txt` and ignore `.secrets/`.
5. Add the currently attached KLUB-CY domain and planned Wix backend subdomain to the environment file.
6. Validate and launch Claude Code with the bundled plugin.
7. Paste the fenced prompt from `ONE_SHOT_PROMPT.md`.

The recommended first run sets Wix writes to true but keeps production deployment and domain cutover false. It provisions and tests the Wix backend and an integrated preview while leaving the current live Wix domain and production Netlify release unchanged.

## Package Contents

| Path | Purpose |
|---|---|
| `plugin/claude-code-wix-development/` | Validated local Claude Code plugin, complete Wix skill/corpus, official Wix migration resources, and examples |
| `ONE_SHOT_PROMPT.md` | Copy-paste autonomous execution prompt |
| `MANUAL_STEPS_BEFORE_RUNNING.md` | Exact macOS/Linux and Windows preparation steps |
| `workflow/KLUB_CY_EXECUTION_WORKFLOW.md` | Architecture, stages, approvals, validation, release, and rollback |
| `workflow/RECOVERY_PLAN_TEMPLATE.md` | Safeguard register and verifiable frontend, CMS, form, OAuth, DNS, and business-flow recovery checks |
| `config/target.lock.json` | Immutable Wix account/site/source safety lock |
| `config/.env.klub-cy.example` | Secret-safe local execution template |
| `scripts/preflight.py` | Read-only target, API-key, CMS, backup, OAuth, Forms, and domain check |
| `scripts/build-klub-payloads.mjs` | Deterministic source-to-CMS transformer; no Wix calls |
| `scripts/generate_wix_plan.py` | Exact no-write collection and bulk-save request planner |
| `scripts/capture-netlify-baseline.mjs` | Password-aware source screenshot and content capture without storing the password |
| `scripts/validate-bsport.mjs` | Source, build-output, `/book/`, widget-ID, and optional CDN integrity check for Bsport |
| `scripts/launch-claude-with-wix-plugin.*` | Local-plugin launchers for macOS/Linux and Windows |
| `references/live-schemas/` | Live Wix REST method schemas captured through the official Wix MCP |
| `references/evidence/` | Sanitized destination, source, Netlify, architecture, and endpoint evidence |
| `migration-state-template/` | Durable migration-state layout copied into `.klub-wix-migration/` |

## Verified Live State

| Item | Verified result |
|---|---|
| Wix account and site | Exact account/site/name triple resolved |
| Site state | Draft Premium Classic Editor site with Velo and a custom domain |
| Headless clients | Zero |
| Native CMS collections | Zero |
| Wix app-owned collections | Fifteen; never delete or replace |
| Wix Forms | Wix Forms application present; zero form schemas |
| CMS backups | Zero |
| API key | Required read-only site/CMS/backup/OAuth/Forms checks passed |
| Domain API permission | Missing `DOMAINS.READ_CONNECTED_DOMAINS`; manual domain entry or key update required |
| Source build | Passed |
| Focused Playwright suite | 193 passed, five skipped |
| Protected Netlify deployment | Password gate and current KLUB homepage verified |

## Security Model

No credential is included in this package. The Wix key remains in an ignored local file, and only the protected-preview password is stored in `.env.klub-cy.local`. Administrator-login credentials are not requested. The API key is never placed in the browser bundle. Three independent flags control Wix data/configuration writes, Netlify production deployment, and domain/DNS cutover.

## Supported Completion States

| State | Meaning |
|---|---|
| `evaluation_complete` | Plugin, MCP, target, source, endpoint contracts, requests, and code/tests are validated; no Wix writes |
| `preview_migration_complete` | Wix backend and integrated deploy preview pass; production deployment/domain cutover remain pending |
| `production_frontend_complete` | Integrated frontend is deployed to the linked Netlify production site but current domain assignment remains unchanged |
| `production_complete` | Coordinated main-domain, Wix-subdomain, hosted-page, TLS, redirect, functional, and observation checks pass |
| `complete_with_gaps` | Only explicitly accepted non-critical gaps remain |
| `blocked` | A typed permission, authentication, schema, data, Netlify, or domain dependency remains unresolved |

## References

[1]: https://dev.wix.com/docs/go-headless/self-managed-headless/get-started/migrate-from-an-existing-wix-site/migrate-a-wix-site-to-a-headless-project "Migrate a Wix Site to a Self-Managed Headless Project"
