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

Set the production domain in `astro.config.mjs` (`site`) — currently `https://klub.cy`.
Changing it needs three coordinated edits: `astro.config.mjs` (`site`), `src/site.ts`
(`url`) and `public/admin/config.yml` (`site_url`, which drives the CMS "View Live" links).

## Editing content — the CMS at `/admin/`

The site has a built-in editing panel ([Decap CMS](https://decapcms.org), free and
open-source) at **`/admin/`**. Non-developers can edit — with no code — the studio
contact details, opening hours, announcement banner, homepage intro, price tables,
class descriptions and the entire FAQ. Everything editable lives in `src/content/*.json`;
each save is a git commit, and the site rebuilds automatically.

The panel's built-in preview pane is disabled (`editor.preview: false`) — it renders
field values with none of the site's CSS, which misleads more than it helps. Every page
entry instead carries a `preview_path`, so the toolbar's **View Live** link opens that
entry's real page. Studio Settings has no page of its own, and the Homepage entry is the
site root, so those two fall back to the site root.

Guardrails worth knowing about when editing `config.yml`:

- **Decap rewrites each managed JSON file from the declared fields on every save**, so a
  key with no field is silently deleted and a field with no data is written back empty.
  Both halves of any content change must land together; `tests/cms-config.spec.ts` guards this.
- Four fixed-length lists (`home.stats`, `instructors.stats`, `about.space.images`,
  `classes.classes`) plus the pricing column headings carry `allow_add: false`,
  `allow_remove: false` and `min`/`max`. Deleting `classes[3]` would destroy
  `/classes/private-sessions/`, which the timetable links to.
- Eleven fields carry a `pattern` with a plain-English error message; the booking URL is
  the important one, since `src/site.ts` returns it raw into every Book `href`.
- Every image field caps uploads at 5 MB and every video field at 20 MB
  (`media_library.config.max_file_size`) — Decap has no global default for this, so the
  limit must be repeated per field. Uploads go into git history permanently via Git Gateway.

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
- `openingHours` — **placeholder values, confirm with Izzy before launch.** Currently
  Mo–Fr 07:00–20:00 and Sa 09:00–12:00. These go straight to Google as the studio's
  opening hours (`openingHoursSpecification` in the LocalBusiness schema).
- `ga4Id` / `clarityId` — paste the GA4 Measurement ID and/or Microsoft Clarity project
  ID to switch on analytics (nothing loads while empty). Event dictionary and setup
  steps in `docs/handover-for-alex.md`.

Other launch tasks (from the PRD checklist):

- [ ] Create & verify the Google Business Profile (start early — postal verification is slow)
- [ ] Replace the planned timetable in `src/pages/timetable.astro` with the live booking embed
- [ ] Add GA4 + Search Console verification (GA4/Clarity: paste IDs in CMS → Studio Settings; add a cookie-consent notice before enabling in production)
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
