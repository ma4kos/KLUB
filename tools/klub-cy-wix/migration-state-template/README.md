# KLUB-CY Migration State Template

Copy this structure to `.klub-wix-migration/` in the KLUB repository. The directory must remain ignored by Git because it can contain authenticated browser storage state, redacted API receipts, deploy metadata, and operational evidence.

| Path | Required contents |
|---|---|
| `intake.json` | Source, destination, architecture, delivery mode |
| `destination.json` | Pinned account/site/name and current read-back state |
| `preflight.json` | Sanitized API/MCP/permission checks and blockers |
| `source-inventory.json` | Routes, content, forms, assets, tests, hashes |
| `mapping.json` | Source-to-Wix collection, item, media, form, and route mapping |
| `execution-plan.json` | Ordered exact operations, body files, hashes, gates, rollback |
| `crosswalks/` | Stable source IDs and hashes mapped to Wix IDs and URLs |
| `validation/` | Build, Playwright, visual, accessibility, SEO, route, form, secret, and API evidence |
| `receipts/` | Redacted successful write, backup, OAuth, deploy, and domain receipts |
| `backups/` | DNS snapshots, local metadata, and non-secret backup identifiers |
| `completion.json` | Aggregate stage status, unresolved gaps, and next action |

Chat output is not a substitute for these records. Resume from the latest validated state files rather than re-running writes from memory.
