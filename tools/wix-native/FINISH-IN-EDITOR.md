# Finishing the Wix build — the hand-work, in order

Everything the Wix API can do has been done. What is left genuinely cannot be
done through the API; this is the checklist for doing it in the browser.

**The site to work on: "Klub 2"**
`2a3b3fcb-a169-4101-a350-2d2e1e99e573`

- Editor — https://editor.wix.com/edit/od/b4268c76-32eb-4e11-8db1-d19e8e07fc81?metaSiteId=2a3b3fcb-a169-4101-a350-2d2e1e99e573
- Preview — https://editor.wix.com/html/editor/web/renderer/external_preview/document/b4268c76-32eb-4e11-8db1-d19e8e07fc81?metaSiteId=2a3b3fcb-a169-4101-a350-2d2e1e99e573

It already has: the 12 pages, the 8 homepage sections in Alex's order, his
wording, the correct menu order, and **his 12 photographs sitting in the Media
Manager ready to place**.

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

## 2. Fix the locale — 1 minute

Dashboard → **Settings → Language & Region**. It was created as US / USD /
America-Los_Angeles; set **Cyprus / EUR / Asia-Nicosia**. Site Properties is
read-only over REST, so this cannot be scripted.

## 3. Add the bsport booking calendar — 5 minutes

On the **Schedule** page, add an **Embed → Custom Code / HTML iframe** and paste
the widget. Company `6604`, widget `868966`, loader
`https://cdn.bsport.io/scripts/widget.js`. The working markup is in
`src/components/BsportWidget.astro`. Do **not** use Wix Bookings.

## 4. Wire the founding-member form — 5 minutes

Wix Forms is already installed. Add a form under the closing section with a
single email field, headed **Founding Members**.

## 5. Per-page SEO — deferred, retry later

Wix's SEO service is currently returning server-side timeouts
(`499 CANCELLED`, 25s against their own 10s budget) on every write. The request
shape is correct and verified:

```
PATCH https://www.wixapis.com/promote/seo/v1/item-seo-tags/STATIC_PAGE/{itemId}
{ "itemSeoTags": { "tags": [ {"type":"title","children":"..."},
    {"type":"meta","props":{"name":"description","content":"..."}} ] },
  "fieldMask": "tags" }
```

Page IDs: Home `c1dmp` · Classes `ss38w` · Foundations `eeq4y` · Signature
`cppey` · Mat `xkjwx` · Privates `yxedd` · Schedule `die2e` · Memberships
`wgtdt` · About `fbunq` · Instructors `cv9bn` · Location `pw6u0` · Contact
`ln1z1`. Titles are in `klub-wix-site-spec.json`.

Note the documented quirk: `publish: true` writes only the published revision,
never the saved one, so send each change twice if you want both.

## 6. Publish — when Alex has approved

Dashboard → Publish. **Do not connect a domain.**
`www.keeplivingunderbalance.com` still serves the studio's existing site and the
cut-over is a separate, deliberate decision.

---

## Housekeeping — sites this exercise created

| Site | What to do |
|---|---|
| **Klub 2** `2a3b3fcb` | **keep** — the build described above |
| Klub 3 `e4576adc` | trash — the image-URL experiment; generator ignored the URLs |
| Klub 1 `a415605e` | trash — structure only, no copy |
| Klub `0894a982` | **unpublish**, then trash — failed one-pager, currently live at markossymeonides.wixsite.com/klub |
| KLUB Headless Test `cc7fa0d1` | leave alone |
| KLUB-CY `20f11f6f` | leave alone |

Each refinement needs a new generated site because reusing a `jobId` does
nothing, which is why there are four. Nothing was deleted without asking.
