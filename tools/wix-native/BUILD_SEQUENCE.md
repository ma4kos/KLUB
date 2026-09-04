# Native Wix rebuild — build sequence

**Goal.** A real Wix site Alex edits visually: he moves a section, changes a button, edits text, and sees it — without a developer. This is deliberately *not* the Wix-managed headless route already wired into this repo, which keeps the site as Astro code and leaves every structural change a code change.

**Input.** `klub-wix-site-spec.json` in this folder — generated from `src/content/*.json`, so it cannot drift from the live site. Regenerate with `node tools/wix-native/build-wix-site-spec.mjs`.

---

## Where this can run

It needs the **Wix MCP connector** (`CallWixSiteAPI`, `ListWixSites`, `ManageWixSite`, and the documentation tools) or a Wix API key with site-creation scope.

Confirmed unavailable in the Claude Code remote session that produced this spec: the Wix connector is not in that session's connector list, `www.wixapis.com` is refused at the proxy, and no key is present. Run it instead where the connector is authorised — claude.ai chat or Cowork, with the Wix plugin enabled (`wix-manage`, `wix-design-system`, `wix-docs`).

---

## Resolve schemas, don't guess them

**Start with the captured live schemas already in this repository** — `tools/klub-cy-wix/references/live-schemas/`. These are recordings of real Wix API responses (captured 2026-09-02), not documentation, so they show exact request and response shapes:

| Stage | Capture |
|---|---|
| 2 — media | `Wix_Media_Live_Schemas.json`, `Wix_Generate_File_Upload_URL_Live_Schema.json` |
| 5 — forms | `Wix_Forms_Live_Contracts.json` |
| CMS, if needed | `Wix_CMS_Live_Schemas.json`, `Wix_List_Data_Collections_Live_Schema.json`, `Wix_Query_Data_Items_Live_Schema.json` |
| other | `Wix_OAuth_App_Live_Schemas.json`, `Wix_Duplicate_Site_Live_Schema.json`, `Wix_Create_Contact_V4_Live_Schema.json`, `Wix_Backup_Live_Schemas.json` |

`tools/klub-cy-wix/references/evidence/Verified_Live_Wix_API_Contracts.md` records which calls were actually exercised and the permission each needed — read it first if you hit a 403.

Cross-check the captures against current docs before relying on them; Wix moves. Where a capture is silent, resolve the contract with the MCP's own documentation tools — `SearchWixRESTDocumentation` / `SearchWixSDKDocumentation`, then `ReadFullDocsMethodSchema` for the exact request shape — and call what they return. Every stage below states the *intent* and the *acceptance check*, not a guessed endpoint.

---

## Stage 0 — Preconditions

1. `ListWixSites` — confirm the account and list existing sites.
2. Identify and **leave alone**: the studio's existing live Wix site on `www.keeplivingunderbalance.com`, and `20f11f6f-…` (KLUB-CY, an unrelated empty sandbox).
3. Create a **new** site for this rebuild via the API. If site creation is not available to your credentials, say so and stop — do **not** fall back to the Wix CLI, whose `--api-key` flag is silently ignored (CLI 1.1.242) and which falls through to a browser device-login that an unattended session cannot complete. Name it clearly, e.g. `KLUB — native rebuild`. Record its site id in the run log.
4. Do not connect any domain. Do not change plans or billing.

## Stage 1 — Theme

Apply `spec.theme`: the nine colours, DM Serif Display for headings and DM Sans for body, the three corner radii, 1200px content width.

*Accept:* a heading renders in DM Serif Display on `#F7F3EE`; a primary button is `#1A1714` with 12px radius.

## Stage 2 — Media

Upload all 24 files in `spec.media` to the Wix Media Manager, preserving the alt text carried alongside each reference in the spec. Keep the source paths in the run log so later stages can map a spec path to a Wix media id.

*Accept:* every `spec.media[].path` maps to a Wix media id; nothing missing.

## Stage 3 — Pages and SEO

Create the 15 pages in `spec.pages` (plus the homepage) at the exact slugs given. Set each page's title and meta description from its `seo` block verbatim — they are already written and tested.

*Accept:* slugs match the spec exactly; no page is left with a default Wix title.

## Stage 4 — Homepage

Build the eight sections of `spec.homepage.sections` in order, using **native Wix sections and elements** — this is the stage that determines whether Alex can actually rearrange things later, so no embedded custom code here.

Per section, `layout` names the arrangement, and the backgrounds matter: section 05 sits on sand `#E8DFD3`, section 07 on ink `#1A1714` with light text. The hero and section 07 headings are uppercase with 0.14em letter-spacing — set that as a text property, never by typing spaces between letters, or screen readers spell the words out.

*Accept:* the page reads top to bottom as the spec lists it, and every section can be dragged to a new position in the editor.

## Stage 5 — The two integrations

**bsport calendar** (`spec.integrations.bsportCalendar`) — a custom HTML embed on `/book`, full content width, min-height 560px, using the loader and mount config verbatim. Bookings and payments stay in bsport; do not rebuild them in Wix Bookings.

**Founding-member form** (`spec.integrations.foundingMemberForm`) — a native Wix Form with the three fields given, so submissions land in the Wix dashboard. Place it below homepage section 07, and on `/founding-member` and `/book`.

*Accept:* the calendar renders real classes in a real browser (it will not render under automation); a test form submission appears in the Wix dashboard.

## Stage 6 — Remaining pages

Populate the interior pages from each entry's `content`. `/pricing` carries the full price tables; `/faq` the question set; `/classes/*` one page per class.

*Accept:* every price on `/pricing` matches `src/content/pricing.json`; no invented values anywhere.

## Stage 7 — Analytics

Add GA4 and Clarity in Wix Marketing Integrations once Alex supplies the IDs (both are empty today). Track clicks on every Book control — that is the conversion Alex optimises for, and Clarity is already how he studies behaviour. Add a cookie-consent banner before any paid traffic; Cyprus is EU.

## Stage 8 — Verify, then stop

Run the verifier before claiming anything is done:

```bash
node tools/wix-native/verify-wix-site.mjs <newSiteId>
```

It re-reads the live site through the Wix REST API and compares it with this spec: every page present at its exact slug with its SEO title, all 24 media files uploaded, no production domain connected, and the target not one of the protected sites. It exits non-zero on any blocking failure. A build that "looks right" but drops a page or a media file fails here rather than in front of Alex. If an endpoint path in the script is stale, repoint it — each carries a `need` note saying what it must read — but do not weaken a check to make it pass.

Publish to a **Wix preview only**. Walk every page on a phone and a desktop. Then stop and hand back:

- the new site id and its preview URL;
- a page-by-page checklist of what was built;
- anything in the spec that could not be reproduced natively, and what was done instead;
- confirmation that no domain was connected and no existing site was touched.

Going live is a separate, explicit decision: it means pointing `www.keeplivingunderbalance.com` at the new site and retiring the Netlify deployment.

---

## Guardrails

Carried from `spec.doNot`, and not negotiable:

- **Never name Izzy, link her personal socials, or identify her as owner.** A standing regulatory constraint on all public content. She may appear unnamed in photography.
- **Do not connect the production domain** during the build.
- **bsport stays** as the booking system.
- **Do not touch site `20f11f6f-…`** (KLUB-CY sandbox) or the existing live site.
- **Invent nothing** — no prices, class names, addresses or hours that are not in the spec. Anything genuinely missing goes on the open-questions list instead of being filled in.

## What this rebuild trades away

Worth stating plainly so the decision stays informed. Moving off the Astro codebase gives up the Playwright suite (14 specs across four browser projects), the CMS contract test, some page speed, and the git history as the source of truth. It buys the thing Alex actually asked for: a site he can restructure himself in minutes. The content model in `src/content/*.json` remains the reference for what the site *says*, whoever renders it.
