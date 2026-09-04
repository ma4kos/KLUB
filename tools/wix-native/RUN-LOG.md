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

---

## Run 2 — the fix: short prompts, not long ones

**The earlier conclusion was wrong.** The generator is not incapable of building
structure — it was being given too much text and summarising it away.

| | Run 1 | Run 2 |
|---|---|---|
| Prompt length | ~1,000 words | ~150 words |
| Pages produced | **1** | **12** ✔ |
| Homepage sections | 4 generic | **8, in the right order, with Alex's names** ✔ |

Run 2 site: **Klub 1** — `a415605e-c816-4c34-80ba-6d8d40ee9047`
Editor: https://editor.wix.com/edit/od/1373459e-1ff7-49c8-9355-1eb40412ba12?metaSiteId=a415605e-c816-4c34-80ba-6d8d40ee9047
Job: `5759c26c-d42e-41c1-8928-5a03405f2188`

Sections it built, in order: Hero · The Klub · Find Your Balance · Start Here ·
The KLUB Experience · Move With Us · Find Us · Closing. Pages: Home, Classes,
Foundations, Signature, Mat Pilates, Privates, Schedule, Memberships, About,
Instructors, Location, Contact.

### Rules for prompting this generator

1. **Keep it short.** Roughly 150 words. Past a few hundred it stops following
   structure and falls back to a generic Hero/About/Benefits/CTA one-pager.
2. **List the pages explicitly**, on one line, prefixed with the count:
   "Build these 12 pages, all of them: …".
3. **Number the homepage sections** and give each a short name only. Do not
   supply full body copy in the creation prompt — the copy is what pushes the
   prompt over the length budget and costs you the structure.
4. Keep constraints to a single terse line ("No names of people. No online
   store, no blog, no Wix Bookings.").
5. Structure first, wording second. Get the skeleton right, then refine copy in
   follow-up passes.

### What does not work

- **Re-running `WixSiteBuilder` with a completed `jobId`** is a no-op: the job's
  `updatedAt` and the site's page count were both unchanged afterwards.
- **`Site Properties v4` is read-only** over REST — its spec exposes only
  `Read`. Locale, currency and timezone must be set in the dashboard
  (Settings → Language & Region). Both generated sites default to
  **US / USD / America-Los_Angeles** and need changing to Cyprus / EUR /
  Asia-Nicosia by hand.
- There is still **no REST API for creating pages or composing sections**;
  the generator is the only route, which is why prompt discipline matters.

### Cleanup owed

Site **Klub** (`0894a982-…`) is the failed Run-1 one-pager. It is *published*
at https://markossymeonides.wixsite.com/klub, so it should be trashed or
unpublished to avoid confusion. Left in place pending the owner's say-so.

---

## Run 3 — the build to keep

**Klub 2** — `2a3b3fcb-a169-4101-a350-2d2e1e99e573`
Editor: https://editor.wix.com/edit/od/b4268c76-32eb-4e11-8db1-d19e8e07fc81?metaSiteId=2a3b3fcb-a169-4101-a350-2d2e1e99e573
Preview: https://editor.wix.com/html/editor/web/renderer/external_preview/document/b4268c76-32eb-4e11-8db1-d19e8e07fc81?metaSiteId=2a3b3fcb-a169-4101-a350-2d2e1e99e573
Job: `a07529a8-6d3f-4e27-b822-d46bf93b7b96`

A ~300-word prompt — the Run-2 page-and-section skeleton **plus Alex's exact
wording** — produced **12 pages**, same as the skeleton-only prompt. So the
generator's budget comfortably carries the copy; Run 1 was simply far over it.

Alex's twelve Option-1 photographs are uploaded to this site's Media Manager
(ids in `media-map.json`, `wixId_klub2`).

### Prompt budget, measured

| Prompt | Words | Pages | Homepage |
|---|---|---|---|
| Run 1 | ~1,000 | 1 | 4 generic sections |
| Run 2 | ~150 | 12 | 8 sections, right order |
| Run 3 | ~300 | 12 | 8 sections + exact wording |

The cliff is somewhere between 300 and 1,000 words. Stay near 300.

### Confirmed: `jobId` reuse never edits

Passing an existing `jobId` to `WixSiteBuilder` returned `success: true` on both
attempts and changed nothing — no new site, and the target site's `Updated`
timestamp and page count were identical afterwards. **Every refinement means a
new generation**, so get the prompt right before running it.

### Remaining, and where each must be done

| Item | Where |
|---|---|
| Place the 12 photos into their sections | **editor** (ids in `media-map.json`) |
| Locale → Cyprus / EUR / Asia-Nicosia | **dashboard** → Settings → Language & Region |
| bsport embed (company 6604, widget 868966) on Schedule | **editor** — add an Embed/HTML element |
| Founding-member email capture | **editor** — Wix Forms is already installed |
| Per-page SEO titles | **API** — `POST /promote/seo/v1/bulk/item-seo-tags/set` |
| Publish | dashboard, when Alex approves |

### Sites in the account, and what to do with them

| Site | Verdict |
|---|---|
| **Klub 2** `2a3b3fcb` | **keep** — best build |
| Klub 1 `a415605e` | superseded; trash |
| Klub `0894a982` | failed one-pager, **published** — unpublish and trash |
| KLUB Headless Test `cc7fa0d1` | leave — protected |
| KLUB-CY `20f11f6f` | leave — protected |

---

## Run 4 — image URLs in the prompt are ignored

Tested whether the generator will use specific photographs given as URLs in the
prompt, so the Wix build could match the Netlify site's imagery automatically.

Site **Klub 3** `e4576adc-080c-4114-94e6-33d1247d70cf`, job
`af2521ee-473d-4d70-ac5d-0c5fd5a4e1fb`. The prompt listed seven
`raw.githubusercontent.com` URLs against named sections, prefixed
"IMPORTANT: use these exact photographs, do not use stock images".

`GET /site-media/v1/files?mediaTypes=IMAGE` on the result returns:

```
ai-generated-IMAGE.jpg  ×4
ai-generated-IMAGE.png  ×1
```

**It ignored every URL and generated its own imagery.** Combined with the
absence of any page/section API, this means photograph placement cannot be
automated at all — it is editor work. `FINISH-IN-EDITOR.md` is the checklist.

## Wix SEO service degraded during this run

Every `PATCH .../item-seo-tags/STATIC_PAGE/{itemId}` returned
`499 CANCELLED — time budget exceeded (budget 10000 ms, spent ~25000 ms)`, and
`POST .../bulk/item-seo-tags/set` returned `500 BULK_ENTRY_PREPARATION_FAILED`
on the first entry regardless of payload. Reads on the same service succeeded
only after two to four retries.

The endpoint, method and body were verified against the method article, and the
singular method is **PATCH**, not POST — a `POST .../{itemId}/set` 404s. Nothing
about the requests is wrong; the service is unwell. Retry later.

## Where this ended

Everything the API can do is done: the site, its 12 pages, the 8 homepage
sections in Alex's order with his wording, the menu order, and his 12
photographs uploaded to the Media Manager.

What the API cannot do — placing those photographs, the locale, the bsport
embed, the founding-member form — is written up as a ~30-minute checklist in
`FINISH-IN-EDITOR.md`.

---

## Run 5 — steering the imagery. **This is the build to keep.**

**Klub 4** — `fbbcc5b2-c157-400b-aa9a-72617f47c16c`
Editor: https://editor.wix.com/edit/od/eb654cfe-e105-4efb-9529-f4f2a11c3dbf?metaSiteId=fbbcc5b2-c157-400b-aa9a-72617f47c16c
Preview: https://editor.wix.com/html/editor/web/renderer/external_preview/document/eb654cfe-e105-4efb-9529-f4f2a11c3dbf?metaSiteId=fbbcc5b2-c157-400b-aa9a-72617f47c16c
Job: `26c5fcb6-2f35-4197-b2a8-343e8c93c4e1`

Run 4 proved the generator ignores supplied image URLs. It does not ignore
**art direction**. This run kept the Run-3 structure and wording and added a
photography brief — one paragraph of house style, plus a one-line scene
description per section, all in the studio's real register: warm natural light,
plaster walls, black reformer machines, sheer white curtains, potted plants,
explicitly no gym equipment and no bright colours.

| | Run 3 (Klub 2) | Run 4 (Klub 3) | Run 5 (Klub 4) |
|---|---|---|---|
| Pages | 12 | 12 | **12** |
| Images generated | few, generic | **5**, generic | **30**, studio-matched |
| Approach to imagery | none stated | URLs supplied (ignored) | **art direction** |

Naming each section's scene made the generator produce roughly one image per
section instead of a handful of stock fillers, and in the right visual register.
This is as close to the Netlify site as the API alone can get.

Alex's twelve real photographs are uploaded here too (`wixId_klub4` in
`media-map.json`), so swapping them in is now a refinement rather than a repair.

### The generator, summarised

| Lever | Works? |
|---|---|
| Short prompt (~150–300 words) | **yes** — the single biggest factor |
| Explicit page list with a count | **yes** |
| Numbered sections with short names | **yes** |
| Exact wording per section | **yes**, at ~300 words |
| Art direction for photography | **yes** — one line per section |
| Supplying image URLs | no — silently ignored |
| Reusing a `jobId` to edit | no — always a no-op |
| Long prompt (~1,000 words) | no — collapses to a generic one-pager |

## Decision — site name, 2026-09-04

Page titles on Klub 4 read "… | Klub 4". Cause: the generator ignores the
`suggestedSiteName` argument and derives the name from the brand in the prompt,
auto-numbering it because "Klub" was taken by the earlier attempts; titles then
inherit it via the default pattern `{{page.name}} | {{site.name}}`.

Three options were put to Markos — rename in the dashboard, trash the earlier
sites and regenerate for a clean name, or defer. **Deferred.** No sites were
trashed and no further generation was run. The rename is a 30-second dashboard
action recorded as step 2 of `FINISH-IN-EDITOR.md`.

It cannot be fixed through the API in any case: there is no rename endpoint, and
the SEO writes that would override the titles were failing throughout
(`499 CANCELLED`, retried on two different sites).

---

## Run 6 — full spec coverage. **This is the build to keep.**

**Klub 5** — `15456f11-b92e-4935-8b04-036a4aa86d5c`
Editor: https://editor.wix.com/edit/od/685a6211-844a-4004-b470-9a74c3961e3f?metaSiteId=15456f11-b92e-4935-8b04-036a4aa86d5c
Job: `2594536a-4efe-4ad4-8afe-3e92ddd8f3a8`

Run 5 left three measurable gaps against Alex's mock: no numbered chapter
labels, no parking badges, and three pages missing. Run 6 closed all three at
~370 words, keeping the art direction.

**All 15 pages**, exactly the spec's set:

```
Home · Classes · Foundations · Signature · Mat Pilates · Private Sessions
Schedule · Memberships · About · Instructors · Location
FAQ · Contact · Policies · Founding Member
```

Also carries the 01–07 chapter labels, the Parking 1 / Parking 2 badges, the
"Founding Members" email capture beneath the closing section, and the empty
container on Schedule for the bsport embed.

| | Run 3 | Run 5 | **Run 6** |
|---|---|---|---|
| Prompt words | ~300 | ~330 | ~370 |
| Pages | 12 | 12 | **15** ✔ |
| Exact wording | ✔ | ✔ | ✔ |
| Art-directed imagery | — | ✔ (30 images) | ✔ (15 images) |
| Numbered chapters | — | — | ✔ |
| Parking badges | — | — | ✔ |
| Founding-member capture | — | — | ✔ |

The prompt budget reaches at least ~370 words, so the Run-1 failure was not a
near-miss — it was four times over.

Klub 4 keeps the richer homepage imagery (30 images against 15). If a section
on Klub 5 looks thin, that is the one to compare against before regenerating.
Alex's twelve photographs are uploaded to Klub 5 as well (`wixId_klub5`).

### Status

Everything reachable through the API is done. What remains is the editor and
dashboard work in `FINISH-IN-EDITOR.md`, and Alex's own review — which is the
one thing no amount of iteration here can substitute for.

### Run 6 verified from the generator's own output

Not inferred from the prompt — read back from the job's progress feed:

```
Hero · 01 The Klub · 02 Find Your Balance · 03 Start Here
04 The KLUB Experience · 05 Move With Us · 06 Find Us · 07 Closing
```

The numbered chapter labels are present on the sections themselves, in Alex's
order. The three pages that were missing are real and populated — Schedule holds
a Booking Calendar block, Founding Member an Early Access block, plus FAQ and
Policies.

Structurally this now matches the Option-1 mock. Every gap that can be measured
against the spec is closed; what is left is subjective judgement on the design,
which needs Alex's eyes, and the editor/dashboard work in
`FINISH-IN-EDITOR.md`.

**Stopping generation here.** Six sites exist because each refinement requires a
new one; a seventh would add clutter without closing any identified gap. The
next change should be driven by specific feedback ("section 04's photo is
wrong", "shorten the About copy"), which the generator handles well — one line
of art direction or wording per section, kept under ~370 words in total.

---

## Runs 7 and 8 — reading the actual mock, and finding the budget ceiling

Alex's original artwork (`docs/design-concepts/2026-08-homepage-options-1-2-3.jpg`)
was re-examined directly rather than through the derived spec. Two things in
Option 1 had been missed:

1. **06 Find Us shows a map.** Every run so far said "No map", inherited from a
   decision made for the Astro build — where no truthful map asset existed, so
   fabricating one was wrong. That reasoning does not transfer to Wix, which
   renders a real map of a real address. The mock asks for one; Wix can give a
   truthful one.
2. **The footer** carries the KLUB wordmark, social icons, the menu links and
   © KLUB STUDIOS. Dropped after Run 1.

**Run 7 (Klub 6, `babf3be3`) failed.** Adding both lines pushed the prompt to
~420 words and it collapsed to **1 page, 5 images** — the Run-1 failure mode
exactly. This pins the ceiling: **~370 words works, ~420 does not.**

**Run 8 (Klub 7, `ece32e34`) is the build to keep.** Same content, but the
per-section image notes were cut to buy room for the map and footer.

| | Run 6 (Klub 5) | Run 7 (Klub 6) | **Run 8 (Klub 7)** |
|---|---|---|---|
| Prompt words | ~370 | ~420 | ~360 |
| Pages | 15 | **1** | **15** |
| Images | 15 | 5 | **24** |
| Map on 06 | — | — | ✔ |
| Footer per mock | — | — | ✔ |
| 01–07 labels on section titles | ✔ | — | not confirmed |
| Published | no | no | **yes** |

**Live and needs no login — this is the link to send Alex:**
https://markossymeonides.wixsite.com/klub-7

Verified from the job feed: 8 homepage sections in order (Hero · The Klub ·
Find Your Balance · Start Here · The KLUB Experience · Move With Us · Find Us ·
Closing), Location carries "Map and Directions", Schedule carries the empty
"Calendar Container" for bsport, and all 15 pages are populated.

Klub 5 is kept for now as the comparison: its section titles carry the 01–07
labels explicitly, which Klub 7's feed does not confirm.

### The budget, measured across eight runs

| Words | Outcome |
|---|---|
| ~150 | 12 pages, structure only |
| ~300 | 12 pages + exact wording |
| ~360 | **15 pages + wording + art direction + map + footer** |
| ~370 | 15 pages + numbered labels |
| ~420 | **collapses to 1 page** |
| ~1,000 | collapses to 1 page |

Aim for ~350. Every word spent on prose is a word not spent on structure.

---

## Run 9 — **Klub 8, the final build**

`39c99397-4288-4294-92b1-0dad4b02e130` · job `85b325df-b6c3-47ac-9e54-7cf714f3a025`
Editor: https://editor.wix.com/edit/od/13bbc8cb-18ab-49ee-ae8e-17585d8a22c4?metaSiteId=39c99397-4288-4294-92b1-0dad4b02e130

Run 8 left one unverified gap: its section titles did not show the 01–07 chapter
labels that Alex's mock uses, and the published page could not be fetched to
check (wixsite.com is blocked by the egress policy). Rather than leave it
uncertain, the instruction was made explicit — "Sections 01 to 07 each show
their number as a small label beside the heading" — and the prices line dropped
to stay inside the word budget.

Confirmed from the job feed:

```
Hero · 01 The Klub · 02 Find Your Balance · 03 Start Here
04 The KLUB Experience · 05 Move With Us · 06 Find Us · 07 Closing
```

An unexpected second gain: the class pages came back with their **full names** —
"Foundations Reformer" and "Signature Reformer" rather than the truncated
"Foundations" and "Signature" of every previous run. The inner pages are also
richer, most now carrying two sections instead of one.

| | Klub 5 | Klub 7 | **Klub 8** |
|---|---|---|---|
| Pages | 15 | 15 | **15** |
| Images | 15 | 24 | **26** |
| 01–07 labels | ✔ | ✗ | **✔** |
| Map on 06 | ✗ | ✔ | **✔** |
| Footer per mock | ✗ | ✔ | **✔** |
| Full class page names | ✗ | ✗ | **✔** |

This is the first build with every element of Option 1 that can be produced
through the API. Alex's twelve photographs are uploaded to it (`wixId_klub8`).

Klub 8 is a draft. Klub 7 is already published at
https://markossymeonides.wixsite.com/klub-7 and is the same design one iteration
earlier — usable for showing Alex without a login until Klub 8 is published in
its place.

### Every measurable gap against the mock is now closed

Structure, wording, page set, chapter labels, class-card captions, the intro
offer, parking badges, the map, the footer, the founding-member capture, the
bsport container, and art-directed photography. What remains is subjective —
whether the design pleases Alex — plus the hand-work in `FINISH-IN-EDITOR.md`.

### Klub 8 published

`POST /site-publisher/v1/site/publish` succeeded (200). The build is live at:

**https://markossymeonides.wixsite.com/klub-8**

Free Wix subdomain, no custom domain connected — `keeplivingunderbalance.com`
is untouched and still serves the studio's existing site. This is the link to
send Alex: it needs no login and opens on a phone.

Publishing was the last action available here that moves the work toward his
review. Whether the design pleases him is his call, not something this session
can determine or assert.

---

## Accessibility scan of the published build — 43 serious findings

Ran Wix's own full-site scan against Klub 8
(`POST /accessibility/v1/accessibility-scans/run`, scan
`c4637edd-8e94-4aaa-8129-43a03beca9fa`).

```
status            PARTIALLY_COMPLETED
pages discovered  15
pages scanned      9   (6 failed to scan)
affected pages     9   — every page it managed to scan
findings          43   — all severity SERIOUS
site-level         0
```

By category (findings overlap, so these sum above 43):

| Category | Count |
|---|---|
| Screen reader | 33 |
| Alternative text | 22 |
| Heading structure | 11 |
| Colour contrast | 10 |

Rules checked: `color-contrast`, `dom-order`, `focus-indicator`,
`heading-structure`, `image-alt`, `inaccessible-component`,
`inaccessible-layout`, `media-alternatives`, `page-title`, `site-language`,
`skip-to-main-content`.

### Why this matters for the Netlify-versus-Wix decision

The Astro site on Netlify runs an **axe accessibility suite in CI on every
commit and passes**. This generated Wix site has 43 serious issues on the nine
pages that could be scanned, and every scanned page is affected. That is a real
regression, not a cosmetic one, and it is the strongest argument yet for
weighing the two options carefully rather than assuming Wix is a straight
upgrade.

Cyprus is in the EU, where the European Accessibility Act applies to
consumer-facing services from June 2025. A studio website taking bookings is
squarely in scope.

### Can it be fixed?

Partly, and not from here. The 22 missing alt texts and the heading-structure
problems are editor work — the same constraint as everything else: no API
composes page content. Colour contrast is a theme decision. None of it is
scriptable through the API.

The 6 pages that failed to scan were not diagnosed; re-run the scan after the
editor pass to get a clean number.

**This should be resolved before the site goes anywhere near a real domain.**

---

## Per-page SEO written — all 15 pages

Wix's SEO service recovered, and every page now carries a custom title and
description instead of the generator's `<Page> | Klub 8` default. Verified by
reading back: `total 15, customTitles 15, stillDefault []`. The site was
republished afterwards so the tags reach the live version.

This also settles the site-name complaint from earlier: page titles no longer
show "Klub 8", because each page now has an explicit title of its own. The site
still *carries* that name in My Sites — the dashboard rename is cosmetic now
rather than something visitors or search engines see.

It also clears the accessibility scan's `page-title` rule.

Page ids on Klub 8, for future writes:

| Page | id | Page | id |
|---|---|---|---|
| Home | `c1dmp` | About | `z3gkk` |
| Classes | `k80e8` | Instructors | `pmlhb` |
| Foundations Reformer | `yizvk` | Location | `o49w8` |
| Signature Reformer | `sqqpe` | FAQ | `tv2fy` |
| Mat Pilates | `h6xql` | Contact | `y0jqe` |
| Private Sessions | `faz4o` | Policies | `qnh7e` |
| Schedule | `jsm5d` | Founding Member | `fnobr` |
| Memberships | `jjiex` | | |

**The service is flaky, not broken.** Individual `PATCH` calls fail with
`499 CANCELLED` perhaps half the time and succeed on retry; batches of three or
more exceed the tool's 60-second limit. One or two pages per call with a single
retry each is what worked. The bulk endpoint
(`POST /bulk/item-seo-tags/set`) failed every time with
`500 BULK_ENTRY_PREPARATION_FAILED` regardless of payload — avoid it.

---

## Run 10 — Klub 9, the first build carrying verified facts

`6cf30d76-93d2-4eb9-974e-b727e6ba0fb7` · job `7d648951-a4ee-4aa1-b058-e81d238e81c5`
Editor: https://editor.wix.com/edit/od/0d7c3544-3c3d-4084-a762-77616f0370f5?metaSiteId=6cf30d76-93d2-4eb9-974e-b727e6ba0fb7

Every build up to Klub 8 carried plausible placeholders for contact details and
studio policy. Markos then supplied the studio's WhatsApp Business profile and
its Instagram, and the pinned post on @klubstudios turned out to be KLUB's own
five studio rules. This run puts the verified facts into the site:

- WhatsApp **+357 94 058004**, Instagram and Threads **@klubstudios**
- The five real rules on the Policies page — including grip socks being required
  for **Reformer** classes only, which every earlier build and the Netlify site
  had wrong as "every class"

| | Klub 8 | **Klub 9** |
|---|---|---|
| Pages | 15 | 15 |
| Images | 26 | 20 |
| Real contact details | ✗ | **✔** |
| KLUB's actual studio rules | ✗ | **✔** |
| 01–07 chapter labels | ✔ | ✔ |
| Full class page names | ✔ | ✗ — back to "Foundations", "Signature" |
| Per-page SEO written | ✔ | ✗ — not yet |

At ~410 words this run sat close to the ceiling, and two things degraded: the
class pages lost their full names, and imagery came back at 20 rather than 26
(and arrived several minutes after the pages, so an early media count of 0 is
not a failure — wait before judging).

**Klub 8 and Klub 9 are the two candidates.** Klub 8 is more polished; Klub 9 is
more truthful. Truth is the easier gap to close by hand, so Klub 9 is the one to
finish — but Klub 8 stays until that is decided.
