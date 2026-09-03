# KLUB-CY Recovery Plan

**Status:** Populate during execution.  
**Target:** Wix site `20f11f6f-6ce3-469d-b44c-df397c750848` only.

> Recovery is evidence-driven. Never call CMS Restore, delete native collections, change domains, or redeploy production from this template without the corresponding live approval and target-lock check.

## Recovery Asset Register

| Safeguard | Identifier or location | State covered | State not covered | Invocation owner |
|---|---|---|---|---|
| Git branch/commits | `<fill>` | Source and configuration | Wix/Netlify/DNS state | Developer |
| Netlify prior deploy | `<fill>` | External frontend | Wix data and domains | Developer |
| Wix site duplicate | `<fill or not-created>` | Selected site design/configuration | Orders, contacts, invoices, plan, custom domain, all third-party apps | Wix owner |
| Wix CMS backup | `<fill or not-created>` | CMS collection data | Frontend, domains, CRM, Forms, OAuth clients | Wix owner |
| DNS snapshot | `<fill>` | Previous public routing and mail records | Frontend/code/data | Domain owner |
| Wix domain assignment snapshot | `<fill>` | Wix primary and hosted-page domain choices | External DNS propagation | Wix owner |
| Source-to-Wix crosswalks | `.klub-wix-migration/crosswalks/` | Migration traceability | Source code itself | Developer |

## Preview Rollback

Disable or abandon the integrated deploy preview. Leave the current Wix editor site and its attached domain unchanged. Confirm the editor site still loads, the protected Netlify baseline remains available, and no production domain or deploy receipt exists.

## Frontend Deployment Rollback

Restore the recorded previous Netlify production deploy. Verify all 16 public routes, assets, forms, `/book/`, Bsport company `6604`, widget `868966`, metadata, sitemap, robots, canonical behavior, and accessibility checks. Read back the Netlify deploy ID and commit.

## Domain Rollback

Restore the exact recorded DNS values and reassign the original main domain to the Wix editor site if it had been unassigned. Restore the prior Wix primary domain and hosted-pages-domain configuration. Preserve `MX`, `SPF`, `DKIM`, and `DMARC` throughout.

Verify:

| Check | Evidence |
|---|---|
| DNS | Authoritative and public resolver values match the prior snapshot |
| TLS | Valid certificate for apex and `www` without mixed content |
| Routing | Apex, `www`, redirects, 404, and all public routes behave as recorded |
| Email | Mail records remain unchanged and test delivery succeeds when approved |
| Wix hosted flows | Login, checkout, policy, or other used hosted page opens on the intended Wix domain |
| Forms | Contact and founding-member test submissions reach the intended destination without duplication |
| Bsport | `/book/` mounts the expected live calendar; no booking is submitted during verification |

## CMS Recovery

Do not automatically delete collections or call Restore Backup. First classify the failure:

| Failure | Default recovery |
|---|---|
| Partial item write | Query by deterministic ID and source hash; re-run only missing or mismatched complete records |
| Incompatible new collection schema | Stop; preserve the collection and generated request; repair through a reviewed migration |
| Incorrect data in kit-owned native collection | Generate a diff from the source payload and apply an approved complete-record correction |
| Need to return to pre-migration CMS state | Use the recorded Wix backup only after an explicit restore approval and an impact review covering all CMS collections |

After CMS recovery, query all six kit-owned collections and verify the expected IDs, source hashes, counts, permissions, and frontend render. Confirm the 15 `WIX_APP` collections remain present and unchanged.

## Forms and CRM Recovery

Disable the new frontend submission endpoint or restore the prior Netlify Forms markup. Do not delete contacts automatically. Verify duplicate protection, consent evidence, notifications, form success/error states, and absence of unintended historical imports.

## Headless OAuth Recovery

Remove a preview domain or callback URI only after verifying that no active frontend uses it. Do not delete an OAuth app during automated rollback. Confirm the public client ID used by the active frontend, allowed domains, allowed callbacks, and member/visitor flows.

## Recovery Completion

Record each action, receipt, owner, timestamp, and read-back result in `.klub-wix-migration/receipts/`. Recovery is complete only when source, deployment, Wix data/configuration, DNS/TLS, forms, Bsport, SEO, accessibility, and business flows match the selected recovered baseline with no unresolved critical or high issue.
