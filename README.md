# KLUB — Pilates Reformer Studio, Limassol

The website for KLUB (Keep Living Under Balance), a premium reformer Pilates studio
opening in Limassol City Center in September 2026. Built with [Astro](https://astro.build)
as a fully static, fast, SEO-first site per the KLUB Website PRD.

## Develop

```bash
npm install
npm run dev        # local dev server at localhost:4321
npm run build      # static build to dist/
npm run preview    # preview the production build
```

## Deploy

Any static host works. Recommended: **Netlify** (the founding-member and contact forms
use Netlify Forms and start working automatically there) or Vercel/Cloudflare Pages
(swap the form `action` for a Formspree endpoint if not on Netlify).

Set the production domain in `astro.config.mjs` (`site`) — currently `https://klub-cy.com`.

## Editing content — the CMS at `/admin/`

The site has a built-in editing panel ([Decap CMS](https://decapcms.org), free and
open-source) at **`/admin/`**. Non-developers can edit — with a live preview and no
code — the studio contact details, announcement banner, homepage intro, price tables,
class descriptions and the entire FAQ. Everything editable lives in `src/content/*.json`;
each save is a git commit, and the site rebuilds automatically.

**Special field — "Online booking link"**: paste the live booking URL (e.g. Wix
Bookings) into Studio Settings and every Book button across the site points to it
automatically. Until then they lead to the pre-launch `/book/` page.

**To activate logins (one-time, ~5 minutes, on Netlify):**

1. Host the site on Netlify (see Deploy below).
2. Site settings → **Identity** → Enable Identity. Under Registration, choose
   **Invite only**.
3. Identity → **Services** → Enable **Git Gateway**.
4. Identity tab → **Invite users** → enter Izzy's / Alex's email. The invite email
   completes signup on the site and lands in the CMS.

**To edit locally without Netlify** (developers): run `npx decap-server` alongside
`npm run dev`, then open `http://localhost:4321/admin/`.

Note: the CMS commits to the `main` branch (`public/admin/config.yml` → `backend.branch`).

## Filling in the blanks (pre-launch TODOs)

Studio facts live in **`src/content/studio.json`** — editable in the CMS (Studio
Settings) or directly in the file. When confirmed, fill in:

- `whatsappNumber` — digits only, e.g. `35799123456`. The floating chat button and all
  "Message us" links switch from Instagram to WhatsApp automatically.
- `phoneDisplay` — e.g. `+357 99 123 456`. Appears in the footer and schema.
- `streetAddress` — the exact street address. Appears in the footer, location page and
  LocalBusiness schema.
- `bookingUrl` — the live booking system URL, when it exists.

Other launch tasks (from the PRD checklist):

- [ ] Create & verify the Google Business Profile (start early — postal verification is slow)
- [ ] Replace the planned timetable in `src/pages/timetable.astro` with the live booking embed
- [ ] Add GA4 + Search Console verification
- [ ] Add real high-res photography (current images are cropped from Instagram at modest resolution)
- [ ] Confirm final pricing (CMS → Pricing, or `src/content/pricing.json`)

## Structure

- `src/content/*.json` — all CMS-editable content (studio facts, homepage intro, pricing, classes, FAQ)
- `src/site.ts` — brand constants + helpers (`whatsappLink`, `bookLink`); merges in `studio.json`
- `src/data/` — class catalogue built from `content/classes.json` + image mappings
- `public/admin/` — the Decap CMS panel (self-hosted app + `config.yml` field definitions)
- `src/layouts/Base.astro` — SEO head, OG tags, LocalBusiness schema, global chrome
- `src/components/` — header, footer, announcement banner, chat button, forms
- `src/pages/` — one file per route; `classes/[slug].astro` generates the four class pages
- `public/images/` — studio photography (used with the owner's permission)
