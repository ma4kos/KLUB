# Native Wix rebuild — run log

Append-only record of what was actually done against Wix, by whom, and what
state the target site was left in. Written so the next session does not repeat
work or create a second site.

---

## Run 1 — 2026-09-04, session `session_01XhEam4dSAo7VNtiQMxSkhS`

**Access path:** Wix MCP connector (OAuth, account `8372deba-8664-4ad5-8212-6c10a7f348b1`).
Direct HTTPS to `www.wixapis.com` remains blocked by the agent proxy (403 at
CONNECT), so the MCP connector is the only working route from a cloud session.

### Site created

| | |
|---|---|
| Name | **Klub** |
| Site ID | `0894a982-a8fd-4a76-bd44-b8822a1b981e` |
| Editor | **Odeditor** (the current Wix visual editor — Alex can edit it by hand) |
| Status | Draft, Free plan, **not published** |
| Apps installed | Wix Forms, Wix Invoices |
| Domain | **none connected** — guardrail held |
| Creation job | `30f80ab5-f9ca-4320-b73e-64e25e3d25b5` (`GENERATE_SITE`) |

The site was generated from a prompt derived from `klub-wix-site-spec.json`:
full Option-1 brief — palette, DM Serif Display / DM Sans, nav order, the eight
homepage chapters with exact wording, the fourteen inner pages, the real
prices, and the de-personalization and no-domain constraints.

### State at the point the connector was lost

The generation job was still `IN_PROGRESS` (about 4 minutes in) when the Wix
MCP server disconnected from the session. Its progress feed showed the homepage
being built as **Hero / About / Benefits / CTA** — four generic sections, not
the eight numbered chapters the prompt specified.

**Treat the site as unverified.** Nothing below was checked against the spec.

### Known gaps — the work that remains

1. **Homepage structure** — likely condensed to 4 generic sections. Needs
   rebuilding to the 8 chapters (Hero, 01 The Klub, 02 Find Your Balance,
   03 Start Here, 04 The KLUB Experience, 05 Move With Us, 06 Find Us,
   07 Closing).
2. **Locale is wrong** — the site was created as `en` / **US** / **USD** /
   `America/Los_Angeles`. Must be Cyprus / EUR / `Asia/Nicosia`.
3. **Imagery is AI placeholder** — the 22 real studio photos in
   `public/images/` have not been uploaded. They are the ones Alex supplied;
   they must replace the generated stand-ins.
4. **bsport calendar not embedded** — company `6604`, widget `868966`,
   loader `https://cdn.bsport.io/scripts/widget.js`. Goes in the empty
   container on the Schedule page. Do **not** use Wix Bookings.
5. **Founding-member form not wired** — Wix Forms is installed, so the app is
   there, but the email capture under chapter 07 is not connected.
6. **Per-page SEO not applied** — titles and descriptions from
   `klub-wix-site-spec.json`. Enumerate pages with
   `GET /promote/seo/v1/item-seo-tags/STATIC_PAGE`, then
   `Bulk Set Item SEO Tags` (≤100 per call, field mask per entry).
7. **Not verified** — `node tools/wix-native/verify-wix-site.mjs 0894a982-a8fd-4a76-bd44-b8822a1b981e`
   has never been run against it.

### Guardrails — all held

- No custom domain connected. `keeplivingunderbalance.com` untouched and still
  serving the studio's existing Wix site.
- Neither protected site was modified: `cc7fa0d1-…` (KLUB Headless Test),
  `20f11f6f-…` (KLUB-CY).
- Netlify production (`klub-cy.netlify.app`, branch `main`) untouched.
- No owner or instructor named anywhere in the generation prompt.

### Sibling session

`session_01PQq6uqmbWTM4DKveFvCDp3` (tag `klub-wix-native-build`, myvault-dev)
was launched earlier to run the same build. It ended **failed / disconnected**
without creating a site that appears in this account. It produced nothing to
carry forward; do not resume it.

### To resume

Re-enable the Wix MCP connector, then work items 1–7 above in order, using
`BUILD_SEQUENCE.md` Stages 1–8 against site
`0894a982-a8fd-4a76-bd44-b8822a1b981e`. **Do not create another site** — check
`ListWixSites` first. If the generated structure is too far from the spec to
edit into shape, delete that site and regenerate rather than accumulating
half-built duplicates.

---

## Finding — why the first run came out generic, and what is actually possible

After the connector dropped, the pinned snapshot of **Wix's own official
migration skills** (`wix/skills` @ `08aa1613`, 340 files, vendored at
`tools/klub-cy-wix/plugin/.../official-wix-replatform/`) was audited to find
the API that composes editor pages and sections directly, instead of relying on
the AI generator to interpret a long brief.

**There isn't one.** Every Wix REST endpoint referenced anywhere in that
snapshot is business data or metadata:

```
bookings/v2/*        stores/v3/provision      pricing-plans/v2,v3
forms/v4/*           reviews/v1/*             addons/v1/*
automations-service/v2                        ecom/v1/orders
promote/seo/v1/item-seo-tags, seo-patterns, site-seo-tags
promote-seo-robots-server/v2/robots
```

No editor, page-layout, or section-composition API appears. Page structure is
not programmatically addressable on a visual-editor (Odeditor) site.

### The two programmatic routes Wix actually supports

| | Route 1 — AI site generator | Route 2 — headless replatform |
|---|---|---|
| What it makes | a real Odeditor site | an Astro + TypeScript + Tailwind project |
| Alex can edit visually | **yes** | **no** — it is code |
| Fidelity to the Option-1 spec | interpreted; it summarises a long brief | high; preserves structure, fonts, SEO, interactions |
| Scope | whole site | **home page only** — `wix-headless-replatform` explicitly rejects additional-page scope |

Route 2 is what `rp-website-continuation` routes to for website-mode
migrations, and it is essentially what already exists on Netlify — the same
codebase, hosted at Wix instead. It does not give Alex a visual editor.

### Consequence for this project

"Programmatic" + "Alex edits it visually" + "exact Option-1 likeness" cannot
all hold at once. Route 1 is the only one that keeps the visual editor, so the
realistic shape of the work is:

1. Generate with Route 1 (**done** — site `0894a982-…`).
2. Fix what the generator condensed, **by hand in the Wix editor** — section
   order and the numbered chapters. This is editor work, not API work.
3. Do programmatically the parts that *are* API-addressable: media upload,
   per-page SEO (`promote/seo/v1/bulk/item-seo-tags/set`), the founding-member
   form (`forms/v4`), site locale, and the bsport embed.

Step 2 is the part no API can do. Budget for it, or accept the generator's
structure.

---

## Run 1 — verified result (connector restored, 2026-09-04 ~03:40)

The generation job finished and **published** the site.

| | |
|---|---|
| Live | https://markossymeonides.wixsite.com/klub |
| Editor | https://editor.wix.com/edit/od/473a7b62-980f-4cfa-be8c-f4919f7907a4?metaSiteId=0894a982-a8fd-4a76-bd44-b8822a1b981e |
| Preview | https://editor.wix.com/html/editor/web/renderer/external_preview/document/473a7b62-980f-4cfa-be8c-f4919f7907a4?metaSiteId=0894a982-a8fd-4a76-bd44-b8822a1b981e |
| Editor type | ODEDITOR — visually editable ✔ |
| Status | Published, free plan, no custom domain ✔ |

### Audit against the spec — it is not close

`GET /promote/seo/v1/item-seo-tags/STATIC_PAGE` returns **one item**
(`itemId: c1dmp`). The generated site has **a single page**.

| | Spec | Generated |
|---|---|---|
| Pages | 15 | **1** |
| Homepage sections | 8 numbered chapters | 4 generic (Hero / About / Benefits / CTA) |
| Locale | Cyprus · EUR · Asia/Nicosia | US · USD · America/Los_Angeles |
| Imagery | 22 real studio photos | AI stock |
| bsport embed | Schedule page | no Schedule page exists |

The eight-chapter brief, the fourteen inner pages, the exact wording, and the
real prices were all in the prompt. The generator kept the brand tone and
discarded the structure.

Note: the SEO listing endpoint times out intermittently (Wix-side 499,
"time budget exceeded", 25s against a 10s budget). It succeeded on the third
attempt with no paging parameters.

### Verdict

Route 1 gives a genuinely editable site but will not reproduce Option-1.
Getting from here to the spec is **manual editor work** — 14 pages to add and
a homepage to restructure — because, per the finding above, no API composes
editor pages or sections. Decide between that, staying on Netlify, or a
narrower Wix scope before spending more.
