# Homepage Layout Concepts — Review (August 2026)

*Review of the three homepage layout concepts (plus the developed comp) against the
current KLUB site, brand system and pre-launch constraints. Concept images live in
this folder: [`2026-08-homepage-options-1-2-3.jpg`](./2026-08-homepage-options-1-2-3.jpg)
and [`2026-08-homepage-developed-comp.jpg`](./2026-08-homepage-developed-comp.jpg).*

> **Context (28 Aug):** the concepts were sent over by Alex (Izzy's partner) on 27 Aug
> asking for feedback. His stated goal is a hard "book now" CTA; his stated worry is
> losing per-page analytics granularity on a long single-page layout. Some facts in the
> mocks that differ from this repo (pricing, class lineup, the Mesa Geitonia address)
> may therefore be *their newer real data* rather than placeholder — they need
> confirming with Alex/Izzy, not silently corrected either way. The analytics and CTA
> questions are answered in the feedback sent back to Alex (summarised in the PR thread).

## Verdict, up front

**Option 1 (Editorial / Minimal / Architectural) is the right base direction**, developed
roughly as the full comp shows — with one full-bleed moment borrowed from Option 2 as an
accent, and **not** Option 3 as the page skeleton.

The concepts' *visual language* is a clear upgrade and sits naturally on the existing
design tokens (warm linen `#F7F3EE`, sand, warm black, thin tracked-out uppercase).
But the concepts' *content* is AI-placeholder and contradicts confirmed studio facts in
several places that must not ship — pricing, class names, the street address, and a live
schedule we can't yet power. Details in "Content red flags" below.

## The three options

### Option 1 — Editorial, minimal, architectural ✅ recommended

Numbered sections (01–07) stacked on warm linen; generous whitespace; photography in
contained strips rather than full-bleed.

**For:**
- Closest to the current codebase: it's still a stack of `<section>`s, so the existing
  page structure, CMS JSON model (`src/content/home.json`) and reveal animations carry
  over — this is a restyle, not a rebuild.
- The numbered-chapter device ("01 The Klub … 07 Keep Living Under Balance") gives the
  long scroll a narrative spine and is cheap to implement (a counter + eyebrow pattern).
- Text on solid backgrounds: best legibility, trivially accessible, no contrast juggling
  over photos.
- Degrades gracefully to mobile — each numbered block just stacks.
- Whitespace-driven premium feel matches the "space that feels like an exhale"
  positioning better than any amount of imagery.

**Against / watch:**
- Risks feeling flat over seven sections if every block has the same rhythm. Fix: vary
  block backgrounds (linen / white / sand / one dark section, as the current site already
  does) and keep one full-bleed image moment (see Option 2).
- The all-caps, letter-spaced hero ("K E E P  L I V I N G …") is striking but should not
  replace the serif voice everywhere — keep DM Serif Display for section headings so the
  brand keeps its warmth. (Also: spaced-out caps must be done with CSS
  `letter-spacing`, never literal spaces, or screen readers spell the headline letter by
  letter.)

### Option 2 — Immersive, fullscreen flow ⚠️ use as accent only

Every section a full-bleed photo with overlaid text.

**For:** maximal atmosphere; the studio photography is genuinely the brand's best asset;
one of these sections makes a superb "The KLUB Experience" or closing-CTA moment.

**Against as the whole page:**
- Text-over-photo everywhere is a permanent contrast/accessibility tax, and the current
  photo set (cropped Instagram images, modest resolution — see README TODO) can't carry
  fullscreen crops until the professional shoot happens.
- Heaviest page weight (LCP suffers; the PRD is SEO/performance-first) and the hardest
  to keep legible across viewport shapes.
- Repeating dark-overlay sections flatten into sameness by section 04 — everything
  emphasized is nothing emphasized.

### Option 3 — Magazine / asymmetric ❌ not as the skeleton

Collage grid, mixed column widths, boxed modules.

**For:** most distinctive at desktop; the class-list-with-thumbnails module (Reformer /
Mat / … with arrows) is genuinely good and worth stealing as a component.

**Against:**
- Highest build and maintenance cost: the collage only works with art-directed cropping,
  which fights the CMS ("Izzy edits a heading, layout breaks" is a real failure mode —
  content here is non-developer-edited JSON).
- Asymmetric grids mostly collapse into an ordinary single column on mobile, where the
  majority of a local-studio audience will be — so the extra cost buys desktop-only flair.
- Visual hierarchy is the weakest of the three: competing boxes, no single obvious path
  to the one action that matters pre-launch (join the founding list / book intro class).

## The developed comp (image 2)

Reads as Option 1's editorial column plus a functional rail (class list → schedule table →
membership cards → FAQ accordion) and a full sitemap footer. Good long-term homepage —
**post-launch**, once a booking system exists. Component notes:

- **Schedule table with per-row "Book" buttons** — cannot ship now: `studio.json.bookingUrl`
  is empty and there is no live booking system (discovery Q5 still open). Until then the
  planned-timetable + "be first on the timetable" capture on `/timetable/` is the honest
  version. Build the module later, driven by a `schedule.json` the CMS can edit.
- **Membership cards + FAQ accordion** — nice pattern; we already have the content
  (`pricing.json` incl. per-class math, and pricing FAQs) — but with the *real* numbers,
  not the comp's (see below).
- **Class list module** (thumbnail / name / three-word descriptor / arrow) — steal this for
  the "Find your class" section; our four classes each already have a `short` line.
- **Map + parking badges in "Find Us"** — great, but blocked on the confirmed street
  address (discovery ★Q1).
- **Numbered closing CTA ("07 Keep Living Under Balance … Book your class")** — keep, but
  pre-launch it should be the founding-member capture (the current dark section), which is
  the single conversion that matters before opening. The comp has no founding/pre-launch
  capture at all — that must be reinstated whatever the layout.

## Content discrepancies in the mockups (confirm before adopting)

Several facts in the concepts differ from the repo's content (which was synced from the
live KLUB site). Each one is either AI placeholder **or** newer information from
Alex/Izzy — confirm which before any of it ships, in either direction:

| In the mockups | In the repo (synced from the live site) |
|---|---|
| Intro offer "3 classes for €39" | Intro **class €20**; 3-class intro **€55** (`pricing.json`) |
| "KLUB Pass — 8 classes €136" | 8-class pack **€176** |
| "Unlimited €148/month" | KLUB+ Unlimited **€280/month** |
| Classes: Reformer / **Mat** / **Sculpt** / Private | Reformer **Fundamentals / Flow / Power** / Private Sessions — no Mat or Sculpt in the catalogue (`classes.json`); are Mat/Sculpt planned formats? |
| Address "Archiepiskopou Leontiou A', Mesa Geitonia 4006" | Street address unannounced (`studio.json`) — is this the confirmed address? Note Mesa Geitonia isn't "city center", which the brand claims everywhere |
| Live weekly schedule with Book buttons | No booking system connected yet; timetable is a planned grid |
| No opening date, no founding-member offer | "Opening September 2026" + founding capture are the site's core pre-launch message |

The hero line itself — "Keep living under balance." — is legitimate (it's the brand
acronym) and arguably a stronger, more ownable hero than the current "Intentional
movement. Mindful strength."; worth putting to Izzy (fits discovery §2).

## Suggested path

1. **Adopt Option 1 as the homepage skeleton** — restyle the existing sections into the
   numbered-chapter rhythm; keep DM Serif/DM Sans and current tokens; add the tracked-caps
   treatment for the hero and section eyebrows.
2. **Steal three modules from the comp:** the class-list rows, the membership cards
   (real prices), and one full-bleed Option 2 moment for "The KLUB Experience".
3. **Keep pre-launch reality:** founding-member section stays; schedule table and map wait
   for the booking system and confirmed address.
4. **Sequence after the photo shoot** — Option 1 tolerates today's imagery; the full-bleed
   moment and the comp's larger crops really want the professional shoot (README TODO).
5. **Put two questions to Izzy** alongside the discovery doc: hero line ("Keep living
   under balance." vs current), and whether the numbered-editorial direction matches her
   gut answer to discovery Q2.1/2.2.
