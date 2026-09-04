# Finishing the Wix build — the hand-work, in order

Everything the Wix API can do has been done. What is left genuinely cannot be
done through the API; this is the checklist for doing it in the browser.

**The site to work on: "Klub 10"**
`ac575e89-105d-44a3-babe-9b3a80ac4f66`

**Live, no login needed — send Alex this:**
# https://markossymeonides.wixsite.com/klub-10

(Klub 7, `ece32e34`, is the same design one iteration earlier and is also live
at .../klub-7. It can be trashed once Klub 8 has been reviewed.)

- Editor — https://editor.wix.com/edit/od/9f148365-6e94-41f6-aca1-28db625d4079?metaSiteId=ac575e89-105d-44a3-babe-9b3a80ac4f66
- Preview — https://editor.wix.com/html/editor/web/renderer/external_preview/document/89744cc7-e6f8-4ac5-90a4-45eae51cba6e?metaSiteId=ece32e34-4e44-4b4e-be5b-cacb89ce6018

It already has: **all 15 pages** of the spec (including FAQ, Policies and
Founding Member), the 8 homepage sections in Alex's order with his numbered
chapter labels, his wording, the parking badges, the founding-member email
capture, the correct menu order, **generated imagery shot to match the real
studio** (warm light, plaster walls, black reformers, sheer curtains, plants),
and **his 12 real photographs sitting in the Media Manager ready to place**.

Because the generated imagery now matches the studio's register, swapping in the
real photographs is an improvement rather than a rescue — the page reads
correctly even before you start.

---

## 1. Replace the stock photos — ~20 minutes

The generator inserts its own AI imagery and there is no API to swap it. In the
editor, click each image, choose **Change Image → Site Files**, and pick the
file named below. All twelve are already uploaded.

| Homepage section | Use this file |
|---|---|
| Hero | `alex-hero-reformers.jpg` |
| 01 The Klub | `alex-corridor-kwall.jpg` |
| 03 Start Here | `alex-trainer-reformer.jpg` |
| 04 The KLUB Experience (left) | `alex-reception-desk.jpg` |
| 04 The KLUB Experience (right) | `alex-lounge-sofa.jpg` |
| 05 Move With Us | `alex-team-bench.jpg` |
| 06 Find Us | `street-sign.jpg` |
| 07 Closing | `alex-closing-reformer.jpg` |

Spares for the class cards and inner pages: `alex-hero-room.jpg`,
`alex-woman-reformer.jpg`, `alex-reformer-window.jpg`, `alex-team-sofa.jpg`.

These are the same photographs the Netlify site uses, so matching them makes the
two look alike. Cross-check against https://klub-cy.netlify.app.

## 2. Rename the site — 30 seconds *(deferred by Markos, 2026-09-04)*

Every page title currently reads "… | Klub 10". Wix ignores the site name passed
to the generator and derives it from the brand in the prompt, appending a number
because "Klub" was already taken by the earlier attempts. Titles inherit it
through the default pattern `{{page.name}} | {{site.name}}`.

Fix: My Sites → rename **Klub 10** to **KLUB**. Every title corrects itself.
(The alternative — trashing the earlier sites and regenerating so the name lands
clean — was considered and set aside.)

## 3. Fix the locale — 1 minute

Dashboard → **Settings → Language & Region**. It was created as US / USD /
America-Los_Angeles; set **Cyprus / EUR / Asia-Nicosia**. Site Properties is
read-only over REST, so this cannot be scripted.

## 4. Add the bsport booking calendar — 5 minutes

On the **Schedule** page, add an **Embed → Custom Code / HTML iframe** and paste
the widget. Company `6604`, widget `868966`, loader
`https://cdn.bsport.io/scripts/widget.js`. The working markup is in
`src/components/BsportWidget.astro`. Do **not** use Wix Bookings.

## 5. Wire the founding-member form — 5 minutes

Wix Forms is already installed. Add a form under the closing section with a
single email field, headed **Founding Members**.

## 6. Per-page SEO — DONE

All 15 pages now carry a custom title and description, written via the API and
published. Nothing to do here. Kept for reference — the working request shape
is:

```
PATCH https://www.wixapis.com/promote/seo/v1/item-seo-tags/STATIC_PAGE/{itemId}
{ "itemSeoTags": { "tags": [ {"type":"title","children":"..."},
    {"type":"meta","props":{"name":"description","content":"..."}} ] },
  "fieldMask": "tags" }
```

Page IDs on **Klub 4**: Home `c1dmp` · Classes `czyml` · Foundations `ghfp7` ·
Signature `x98pp` · Mat `dmv1b` · Privates `v2g73` · Schedule `a2j34` ·
Memberships `m5f7y` · About `auly0` · Instructors `kjl0a` · Location `zr96l` ·
Contact `eplzf`. Titles are in `klub-wix-site-spec.json`.

Note the documented quirk: `publish: true` writes only the published revision,
never the saved one, so send each change twice if you want both.

## 7. Publish — when Alex has approved

Dashboard → Publish. **Do not connect a domain.**
`www.keeplivingunderbalance.com` still serves the studio's existing site and the
cut-over is a separate, deliberate decision.

---

## Housekeeping — sites this exercise created

| Site | What to do |
|---|---|
| **Klub 8** `39c99397` | **keep** — the final build: 15 pages, 26 images, 01–07 labels, map + footer |
| Klub 7 `ece32e34` | trash once Klub 8 is reviewed — same design, one iteration back |
| Klub 6 `babf3be3` | trash — over-length prompt, collapsed to one page |
| Klub 5 `15456f11` | keep until Klub 7 is reviewed — has the 01–07 labels on section titles |
| Klub 4 `fbbcc5b2` | trash — 12 pages only, but richest imagery; keep until Klub 5 is reviewed |
| Klub 3 `e4576adc` | trash — image-URL experiment; generator ignored the URLs |
| Klub 2 `2a3b3fcb` | trash — good copy, but generic imagery |
| Klub 1 `a415605e` | trash — structure only, no copy |
| Klub `0894a982` | **unpublish**, then trash — failed one-pager, currently live at markossymeonides.wixsite.com/klub |
| KLUB Headless Test `cc7fa0d1` | leave alone |
| KLUB-CY `20f11f6f` | leave alone |

Each refinement needs a new generated site because reusing a `jobId` does
nothing, which is why there are nine. Nothing was deleted without asking.
