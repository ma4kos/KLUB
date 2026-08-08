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

## Filling in the blanks (pre-launch TODOs)

All studio facts live in one file: **`src/site.ts`**. When confirmed, fill in:

- `whatsappNumber` — digits only, e.g. `35799123456`. The floating chat button and all
  "Message us" links switch from Instagram to WhatsApp automatically.
- `phoneDisplay` — e.g. `+357 99 123 456`. Appears in the footer and schema.
- `streetAddress` — the exact street address. Appears in the footer, location page and
  LocalBusiness schema.

Other launch tasks (from the PRD checklist):

- [ ] Create & verify the Google Business Profile (start early — postal verification is slow)
- [ ] Replace the planned timetable in `src/pages/timetable.astro` with the live booking embed
- [ ] Add GA4 + Search Console verification
- [ ] Add real high-res photography (current images are cropped from Instagram at modest resolution)
- [ ] Confirm final pricing in `src/pages/pricing.astro` and `src/data/classes.ts`

## Structure

- `src/site.ts` — single source of truth for studio facts (name, contacts, opening date)
- `src/data/` — class catalogue and long-form class content
- `src/layouts/Base.astro` — SEO head, OG tags, LocalBusiness schema, global chrome
- `src/components/` — header, footer, announcement banner, chat button, forms
- `src/pages/` — one file per route; `classes/[slug].astro` generates the four class pages
- `public/images/` — studio photography (used with the owner's permission)
