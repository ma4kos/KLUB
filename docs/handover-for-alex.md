# KLUB homepage — what shipped, and why (handover for Alex)

*August 2026. This explains the new homepage layout, the booking-CTA strategy, the
tracking that's built in, and the SEO reasoning — in plain terms. The last section is a
copy-paste spec: if you ever rebuild the site in Lovable (or any other tool), feed it
that spec and the same decisions survive the rebuild.*

## 1. The layout

The homepage now follows the editorial numbered-chapter layout from the concepts you
sent (the "Option 1" direction): a tracked-out caps hero — **KEEP LIVING UNDER
BALANCE.** — then eight numbered chapters on warm linen/white/sand backgrounds:

| # | Chapter | What it does |
|---|---|---|
| — | Hero | Headline, one-line pitch, primary Book button + timetable link |
| 01 | The Klub | What KLUB is, in two paragraphs |
| 02 | The Standard | The London/Dubai→Limassol story + the numbers row |
| 03 | Find Your Balance | The four classes as tappable rows (photo · name · one-liner · arrow) |
| 04 | Start Here | Intro pricing cards (€20 first class / €32 drop-in / €100 private) + Book button |
| 05 | The KLUB Experience | The one full-screen photo moment (the "Option 2" accent) |
| 06 | Move With Us | Instructors / community teaser |
| 07 | Find Us | Location (address auto-appears site-wide once set in the admin panel) |
| 08 | Keep Living Under Balance | Closing: founding-member signup + Book button |

Deliberate choices:

- **Text sits on solid backgrounds, photos live in frames** — best readability on
  phones, and it works with today's photography. One full-bleed moment (05), not seven:
  when everything is dramatic, nothing is.
- **The founding-member capture stays** (chapter 08). Until the doors open, an email on
  the list is worth more than a page view. Don't remove it in any redesign before launch.
- **All text/photos are editable without code** at `/admin/` (the Homepage entry).
  The spaced-out caps are done with CSS letter-spacing — never type literal spaces
  between letters, or screen readers spell the headline out letter by letter.

## 2. The CTA strategy ("press hard book now")

One primary action, repeated — never competing:

- **One label everywhere**: "Book Your First Class — €20" (hero, chapter 04, chapter 08,
  mobile sticky bar). A priced offer converts better than a generic "book now". Edit it
  once in `/admin/` → Studio Settings → *Main booking button text* and it changes
  everywhere — e.g. when the price changes or after launch ("Book a Class").
- **Sticky mobile bar**: on phones, a booking bar slides in once you scroll past the
  hero and stays one thumb-tap away for the whole page. Desktop keeps the Book button
  pinned in the header.
- **Every Book button on the site already points at one switch**: paste your live
  booking URL (Wix Bookings or anything else) into `/admin/` → Studio Settings →
  *Online booking link*, and every button flips from the pre-launch page to real
  booking. No code.
- **Next-level (when the booking system exists):** make each class row / timetable slot
  deep-link into the booking flow with that class pre-selected. That's the single
  biggest conversion upgrade available.

## 3. Tracking — your "will I lose my metrics?" question

Short version: **you don't lose tracking on a long single page — you change what you
track, and you end up with more detail than pageviews ever gave you.** GA4 is
event-based; pageviews are the old Wix habit. The site now instruments:

| Event | Fires when | What it tells you |
|---|---|---|
| `book_click` | any click toward booking | your #1 conversion signal |
| `cta_click` | any tagged button (each has an id like `hero-book`, `sticky-book`, `class-reformer-fundamentals`) | *which* button/section converts |
| `section_view` | first time a visitor reaches each numbered chapter | how far down the story people get — a per-section funnel |
| `scroll_depth` | 25 / 50 / 75 / 90% of the page | overall engagement depth |

**How to switch it on (5 minutes, no code):**

1. Create a GA4 property at analytics.google.com → copy the Measurement ID (`G-…`).
2. (Recommended, free) Create a project at clarity.microsoft.com → copy the project ID.
   Clarity gives you heatmaps and session recordings — literally every movement.
3. Paste both into `/admin/` → Studio Settings → *Google Analytics 4 ID* / *Microsoft
   Clarity ID*. Until an ID is pasted, **no tracking script loads at all** — zero
   third-party requests, zero cookies.
4. In GA4, mark `book_click` as a conversion (Admin → Events → toggle).

⚠️ **One legal note**: Cyprus is EU, so once GA4/Clarity are live the site should show
a cookie/consent notice. Wix gave you one automatically; here it still needs adding —
any lightweight consent banner works, or ask for one to be added. Don't launch paid
traffic before this is in.

**What to watch in GA4** once live: `book_click` count (conversion), `section_view`
drop-off (where people stop scrolling — reorder chapters accordingly), engagement time
(your retention-rate hunch — you're probably right that it improves).

## 4. SEO — why the site is a hybrid, not a pure one-pager

You're on page 2 and want up. A single-page site gives Google **one** URL to rank; this
site keeps the long-scroll homepage **plus** dedicated pages for every search intent:
`/classes/…` (4 pages), `/pricing/`, `/timetable/`, `/location/`, `/faq/`, `/about/`.
Each has its own title/description, and the site ships a sitemap + LocalBusiness
structured data (opening hours, address once set) that feeds Google Maps results.

The three SEO tasks left (none are code):

1. **Google Business Profile** — create & verify early; postal verification to Cyprus is
   slow. This matters more for "pilates limassol" than anything on the site.
2. **Search Console** — add the domain, submit `/sitemap-index.xml`.
3. **Street address** — the moment it's confirmed, set it in `/admin/` → Studio
   Settings; it flows into the footer, location page and the structured data Google
   Maps reads.

## 5. If you rebuild in Lovable — the spec to paste

Lovable can't import this codebase (its GitHub link is export-only), so a Lovable
version means rebuilding from scratch. If you go that way, paste the block below as
your first prompt so the layout, CTA, tracking and SEO decisions carry over. The real
copy and prices live in this repo under `src/content/*.json` — paste those in too,
don't let the AI invent prices.

```
Build a single long-scroll homepage for KLUB, a premium reformer Pilates studio in
Limassol, Cyprus (brand: "Keep Living Under Balance", opening September 2026).

LAYOUT — editorial, minimal, architectural:
- Warm palette: linen #F7F3EE background, sand #E8DFD3, warm black #1A1714 text,
  umber #7A6A55 accents. Serif display headings (DM Serif Display), DM Sans body.
- Hero: uppercase letter-spaced headline "Keep living under balance." (use CSS
  letter-spacing, never literal spaces), one-line intro, primary button.
- Then numbered chapters (01, 02, …) each with a large faint serif number:
  01 about the studio · 02 credibility story + stats row · 03 the four classes as
  horizontal rows (thumbnail, name, one-line description, arrow) · 04 intro pricing
  cards · 05 ONE full-bleed photo section (the only full-screen image) · 06 team ·
  07 location · 08 dark closing section with email signup + book button.
- Photos framed inside sections everywhere except chapter 05. Mobile-first: chapters
  stack, no horizontal scrolling.

CTA RULES:
- ONE primary CTA label used verbatim everywhere: "Book Your First Class — €20"
  (hero, chapter 04, chapter 08). All Book buttons point to one configurable
  booking URL.
- Sticky header with a compact "Book Now" button on desktop; on mobile a sticky
  bottom bar with the primary CTA that appears after scrolling past the hero.
- Before launch, chapter 08 is a founding-member email signup — do not remove it.

TRACKING (GA4, event-based):
- Give every CTA a data-cta id (hero-book, sticky-book, class-<slug>, closing-book…).
- Fire GA4 events: book_click (any booking click), cta_click (id + label),
  section_view (first time each chapter is 15% visible, once per chapter),
  scroll_depth (25/50/75/90, once each). Load GA4 and Microsoft Clarity only when
  their IDs are configured; include an EU cookie-consent notice.

SEO:
- This homepage is NOT the whole site: also generate separate pages for each class,
  pricing, timetable, location, FAQ and about, each with unique title + meta
  description. Add XML sitemap and LocalBusiness (ExerciseGym) JSON-LD with address,
  opening hours and social profiles. Server-render or statically generate all pages —
  no client-only rendering.
- Do not invent prices, class names, addresses or schedules — I will supply the real
  content. Use placeholder markers where content is missing.
```

## 6. Where everything lives

- Content (all editable at `/admin/`): `src/content/home.json`, `pricing.json`,
  `classes.json`, `faq.json`, `studio.json` (contact, booking URL, CTA label,
  analytics IDs, banner)
- Homepage template: `src/pages/index.astro` · sticky bar:
  `src/components/StickyCTA.astro` · tracking: `src/components/Analytics.astro`
- Layout concepts + design review: `docs/design-concepts/`
- Hosting/domain/transfer guides: `docs/setup-and-hosting.md`, `docs/editing-guide.md`
