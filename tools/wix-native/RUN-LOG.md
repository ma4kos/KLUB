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
