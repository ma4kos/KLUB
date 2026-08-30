# KLUB website — setup & hosting guide

Technical reference for whoever maintains or takes over the KLUB website. For
day-to-day content editing (non-technical), see
[`editing-guide.md`](./editing-guide.md).

- **Repository:** `ma4kos/KLUB` (GitHub, public)
- **Framework:** [Astro](https://astro.build) 5 — a fully static site (no server)
- **Host:** Netlify (project `klub-cy`)
- **Production branch:** `main`
- **Production domain:** `www.keeplivingunderbalance.com` — the studio's
  existing domain (currently still pointing at their old Wix site; the new site
  is live at `klub-cy.netlify.app` until the DNS switch). `klub.cy` is
  registered but awaiting nic.cy ownership approval — optional later addition.

---

## 1. Local development

```bash
npm install
npm run dev        # local dev server at http://localhost:4321
npm run build      # static build into dist/
npm run preview    # serve the production build locally
```

To edit content locally with the visual editor, run `npx decap-server` in a
second terminal alongside `npm run dev`, then open
`http://localhost:4321/admin/`.

Project layout is documented in the repository [`README.md`](../README.md). In
short: all editable content is JSON in `src/content/`, brand constants and
helpers are in `src/site.ts`, the page shell and SEO/schema live in
`src/layouts/Base.astro`, and the editor panel is `public/admin/`.

---

## 2. Hosting on Netlify

The site is a Netlify project called **`klub-cy`**, connected to the GitHub
repository. Netlify reads [`netlify.toml`](../netlify.toml) at the repo root, so
there are no build settings to configure by hand:

```toml
[build]
  command = "npm run build"
  publish = "dist"
[build.environment]
  NODE_VERSION = "20"
```

**Continuous deployment:** every push to **`main`** triggers a Netlify build and
publishes automatically. That includes edits made through the content editor —
each save is a commit to `main`, which Netlify then builds. A build takes a
couple of minutes.

---

## 3. Domain & HTTPS

The site's official (canonical) domain is **`www.keeplivingunderbalance.com`** —
set in `astro.config.mjs` (`site`) and `src/site.ts` (`SITE.url`); a test
enforces that the two agree. The domain currently points at the studio's old
Wix site, so going live on it is a deliberate cut-over:

1. In Netlify → Domain management: **Add a domain** →
   `www.keeplivingunderbalance.com` (add the apex `keeplivingunderbalance.com`
   too, redirecting to `www`).
2. At the domain's registrar, set the DNS records:

```
# keeplivingunderbalance.com (the apex/root)
#   Preferred — if the registrar supports ALIAS / ANAME / "flattened CNAME":
keeplivingunderbalance.com       ALIAS   apex-loadbalancer.netlify.com
#   Otherwise a plain A record:
keeplivingunderbalance.com       A       75.2.60.5

# www (the primary host)
www.keeplivingunderbalance.com   CNAME   klub-cy.netlify.app
```

The moment those records propagate, the domain serves the new site and the old
Wix site stops being reachable on it — so flip DNS only when everyone is ready.

**`klub.cy`** (registered, awaiting nic.cy approval of the ownership transfer)
can be added later the same way — as a redirect to the main domain at first, or
promoted to primary by updating `astro.config.mjs` + `src/site.ts` and
re-running the SEO tests. Nothing in the codebase assumes it exists.

**HTTPS** provisions automatically (Let's Encrypt) once the DNS records point at
Netlify — no action needed beyond the DNS. Until DNS resolves, Netlify shows the
domain as "pending" and cannot issue the certificate; that is expected.

---

## 4. The content editor (Decap CMS + Netlify Identity)

The `/admin/` panel is [Decap CMS](https://decapcms.org) — a static app in
`public/admin/`, configured by `public/admin/config.yml`. It commits content
changes straight to `main`, which is why edits go live automatically.

Two Netlify services make the login work:

1. **Netlify Identity** — the user accounts. Site settings → Identity → Enable,
   with **Registration = Invite only** and email confirmation required.
2. **Git Gateway** — lets editors commit to GitHub without a GitHub account.
   Identity → Services → **Enable Git Gateway**. *(Enabling this needs a one-time
   GitHub authorization popup, so it has to be clicked in a normal browser.)*

**Inviting an editor:** Identity tab → Invite users → their email. They receive
an invite, set a password, and land in the editor. The invite/confirmation links
point at the site's current Netlify address, so editors can be invited now —
no need to wait for any domain. A small script in `src/layouts/Base.astro` forwards Identity's
`#invite_token` / `#recovery_token` / `#confirmation_token` links from the
homepage to `/admin/` so signup completes in the right place.

`config.yml` key points: `backend.name: git-gateway`, `backend.branch: main`,
`local_backend: true` (for the local `decap-server` workflow), media uploads go
to `public/images/uploads`, and `site_url: https://www.keeplivingunderbalance.com`.

---

## 5. Forms

The contact and founding-member forms use **Netlify Forms** — no backend code.
Each form in the built HTML carries `name="…"`, `method="POST"`,
`data-netlify="true"`, a `netlify-honeypot` spam trap, and a hidden
`form-name` input. Netlify detects them at deploy time (form detection must be
enabled on the site, which it is) and collects submissions under
**Netlify → Forms**. Submissions can be forwarded to an email or Slack via a
Netlify notification if desired.

The two forms are `contact` and `founding-member`.

---

## 6. The GitHub Pages preview channel

`.github/workflows/preview.yml` builds the site on every push to `main` or the
build branch and publishes it to GitHub Pages at
**https://ma4kos.github.io/KLUB/** as a shareable preview.

Because GitHub Pages serves the repo under the `/KLUB/` sub-path, the workflow
has a step that rewrites root-absolute URLs (`/…` → `/KLUB/…`) in the built HTML
and CSS. **That rewrite is correct and intentional for the preview only** — the
Netlify production build is untouched by it. Leave the workflow in place; it's a
useful preview link that doesn't affect production.

---

## 7. Booking & the "hybrid" strategy

The site is the production home; online **bookings** are planned to run on Wix
later ("hybrid path"). One CMS field makes the switch: when the Wix Bookings URL
is pasted into **Studio Settings → Online booking link** (`bookingUrl` in
`src/content/studio.json`), every "Book" button across the site points to it
automatically (`bookLink()` in `src/site.ts`). No code change or redeploy of
logic is required — it's a content edit. Until then, Book buttons lead to the
pre-launch `/book/` page.

There is no Wix work in the current setup; the field is the only integration
point.

---

## 8. Transferring hosting to Alex's account

The **repository is the single source of truth**; the Netlify project is
disposable and re-creatable in ~15 minutes. To move hosting to Alex's own
Netlify account:

1. Give Alex access to the repository (add as a collaborator, or transfer the
   repo in GitHub → Settings → Transfer, or fork — decide ownership first).
2. In Alex's Netlify: **Add new project → Import from GitHub → `ma4kos/KLUB`**,
   production branch **`main`**. `netlify.toml` configures the build.
3. **Re-point DNS:** the apex record is unchanged; update the `www` CNAME to the
   new site's `*.netlify.app` name if the project name differs.
4. **Re-enable Identity** (invite-only) and **Git Gateway** on the new site
   (§4), then **re-invite** the editors (existing accounts don't carry over).
5. Confirm forms detection is on and both forms appear.
6. Once verified on the new site, delete or archive the old `klub-cy` project.

Note: Decap CMS authenticates via the site's Git Gateway, not a hard-coded repo
path, so `config.yml` generally needs no change on transfer — but verify a test
edit publishes after the move.

---

## 9. Current status — 2026-08-30

| Item | State |
| --- | --- |
| Site live at `klub-cy.netlify.app`, building from `main` (password-protected) | ✅ Done |
| Canonical domain in code = `www.keeplivingunderbalance.com` | ✅ Done |
| Domain DNS cut-over (Wix → Netlify) | ⏳ When the studio is ready (§3) |
| `klub.cy` | ⏳ Awaiting nic.cy ownership approval — optional later addition |
| Netlify Identity enabled, **invite-only**, email confirmation | ⏳ Verify in Netlify UI (see editing/setup §4) |
| Git Gateway enabled | ⏳ To do (one click, normal browser) |
| Netlify Forms detection enabled | ✅ Done |
| Editors (Izzy, Alex) invited | ⏳ Can be done now — invites use the Netlify address |
| GA4 / Clarity IDs in CMS | ⏳ To do (plus consent banner before paid traffic) |

The contact email `team@klub-cy.com` is intentionally left on the old domain
until the email-hosting decision is made — do not change it as part of the
domain switch.

---

## 10. Troubleshooting quick reference

| Symptom | Likely cause / fix |
| --- | --- |
| A content edit didn't appear | Wait ~2 min for the Netlify build; check Netlify → Deploys |
| Editor login fails | Git Gateway not enabled, or Identity not invite-confirmed; re-check §4 |
| The custom domain doesn't load the new site | DNS not switched/propagated yet, or records incorrect (§3) |
| No HTTPS padlock | Certificate provisions only after DNS points at Netlify (§3) |
| Form submissions missing | Confirm form detection is on and the form has the Netlify markup (§5) |
| Preview site URLs look doubled (`/KLUB/KLUB/`) | That's the GitHub Pages preview only; production is fine (§6) |
