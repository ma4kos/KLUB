# Wix KLUB Source Inventory

**Source repository:** `https://github.com/ma4kos/KLUB`  
**Reviewed branch:** `claude/izzy-pilates-website-w61t75`  
**Live reference:** `https://ma4kos.github.io/KLUB/`  
**Current framework:** Astro 4.16.18 static site.

> **Purpose:** Use this file as the controlled inventory for a Wix Studio rebuild or a Wix-managed Headless migration. It distinguishes what should remain in code, move to Wix CMS, be configured in Wix Bookings, and be kept as a launch-time decision.

## 1. File-System Overview

| Source area | Contents | Wix/headless decision |
|---|---|---|
| `src/site.ts` | Central studio name, contact, location, social and launch details | Keep as code config for headless; make a restricted singleton CMS/config record for Studio. |
| `src/data/classes.ts` | Four class card records | Move to `Classes` CMS collection for Studio; retain or sync selectively in headless. |
| `src/data/classDetails.ts` | Full class detail content | Move to rich CMS fields/dynamic pages for Studio; retain in code for initial headless path. |
| `src/components/` | Header, footer, banner, founding form, WhatsApp button, marquee, image/video components | Recreate as global/saved Studio sections or retain as Astro. |
| `src/pages/` | One Astro route per page plus dynamic class details | Rebuild static pages + CMS dynamic page in Studio or preserve in headless. |
| `src/layouts/Base.astro` | Global layout, SEO, Open Graph, LocalBusiness schema | Reimplement in Studio SEO settings/schema tools or preserve/update headless. |
| `src/styles/global.css` | Brand styles and responsive rules | Translate into Studio theme/global CSS or retain in Astro. |
| `public/images/` | Studio, founder, equipment, logo and social-preview assets | Upload approved JPG assets to Wix Media Manager or retain code-hosted versions. |
| `public/videos/` | Short studio/founder videos and poster images | Upload/serve deliberately; optimize first-frame loading. |
| `public/fonts/` | DM Serif Display / DM Sans WOFF2 files | Use Wix-available fonts where permitted or retain webfont self-hosting in Astro. |

## 2. Page and Route Inventory

| Current source route | Public route | Primary purpose | Studio configuration | Headless configuration |
|---|---|---|---|---|
| `index.astro` | `/` | Brand landing / conversion | Static page | Retain file and connect CTAs. |
| `about.astro` | `/about/` | Studio story / brand philosophy | Static page | Retain. |
| `classes/[slug].astro` | `/classes/<slug>/` | Class detail | Dynamic item page bound to CMS Classes | Retain dynamic Astro route or use Wix CMS data. |
| Class overview content | `/classes/` | Class discovery | Dynamic list page / CMS repeater | Retain or query CMS. |
| `pricing.astro` | `/pricing/` | Price education / booking conversion | Static page with Bookings links | Retain; avoid duplicate operational pricing logic. |
| `timetable.astro` | `/timetable/` | Schedule / booking conversion | Native Bookings widget/page or custom availability flow | Query Bookings availability; do not maintain duplicate timetable. |
| `instructors.astro` | `/instructors/` | Founder profile | Static or CMS page | Retain. |
| `faq.astro` | `/faq/` | Reduce booking friction | Static accordion or FAQ CMS | Retain. |
| `location.astro` | `/location/` | Location and arrival | Static page | Retain. |
| `contact.astro` | `/contact/` | Enquiry/contact conversion | Static + Wix Form | Retain and replace form handling. |
| `founding-member.astro` | `/founding-member/` | Prelaunch lead capture | Static + Wix Form/Contacts | Retain and replace form handling. |
| `policies.astro` | `/policies/` | Operational and legal policy | Static page | Retain; review before public launch. |
| `book.astro` | `/book/` | Booking funnel | Wix Bookings page/widget | Replace static placeholder with Bookings flow. |
| `404.astro` | `404` | Not-found recovery | Studio 404/page settings | Retain with correct brand CTA. |

## 3. Shared Studio Configuration

The current central configuration record should be preserved but not assumed final.

| Key | Current value | Migration location | Status |
|---|---|---|---|
| `name` | KLUB Pilates Studio | Site settings/CMS singleton | Approved content candidate. |
| `shortName` | KLUB | Site settings/CMS singleton | Approved content candidate. |
| `tagline` | Intentional Movement. Mindful Strength. Real Connection. | Theme copy record | Approved content candidate. |
| `url` | `https://klub-cy.com` | Production domain config | Validate domain ownership/decision. |
| `email` | `team@klub-cy.com` | Contact/operations config | Validate inbox and monitoring. |
| `whatsappNumber` | Blank | Wix contact/CTA config | Required before WhatsApp activation. |
| `phoneDisplay` | Blank | Wix contact/CTA config | Required before phone CTA activation. |
| `streetAddress` | Blank | Location, map, schema/config | Required before precise location release. |
| `addressLocality` | Limassol City Center | Location content | Current marketing copy. |
| `addressCountry` | Cyprus | Location content | Current marketing copy. |
| `instagram` | `https://www.instagram.com/klubstudios` | Footer/social config | Validate account ownership. |
| `facebook` | Existing shared URL | Footer/social config | Validate URL before launch. |
| `openingLabel` | Opening September 2026 | Announcement banner | Confirm public communications date. |
| `openingDate` | 2026-09-01 | Launch configuration | Confirm operational date. |

## 4. Class Content Inventory

| Slug | Class | Duration | Capacity | Proposed display price | Existing hero asset | Recommended Wix Bookings type |
|---|---|---:|---|---:|---|---|
| `reformer-fundamentals` | Reformer Fundamentals | 50 min | Max 6 people | From €20 | `equipment-wall.jpg` | Class |
| `reformer-flow` | Reformer Flow | 50 min | Max 6 people | From €20 | `studio-room.jpg` | Class |
| `reformer-power` | Reformer Power | 50 min | Max 6 people | From €20 | `mat-studio.jpg` | Class |
| `private-sessions` | Private Sessions | 50 min | 1-to-1 | From €70 | `interior-arch.jpg` | Appointment |

The prices above are existing site content, not a verified commercial configuration. The source’s own migration notes list a current working pricing draft that includes a €20 drop-in, €32 intro pack, monthly memberships, flexi packs and private-session packages; final validation is required before payment activation.

## 5. Image and Video Asset Inventory

### Images

| File group | Use | Recommended action |
|---|---|---|
| `arch-entrance.*`, `interior-arch.*`, `studio-room.*`, `reception.*`, `lounge.*`, `klub-lounge.*` | Studio environment / arch visual language | Upload approved JPG; use optimized dimensions and accurate alt text. |
| `equipment-wall.*`, `klub-reformers.*`, `mat-studio.*` | Equipment and class imagery | Use class/page cards and dynamic class hero assets. |
| `izzy-cyprus-pool.*`, `izzy-dubai-reformer.*`, `izzy-dubai-teaching.*`, `izzy-mat-wide.*`, `izzy-pilates.*` | Founder story / credibility | Use only content-rights-confirmed images. |
| `street-sign.*` | Location / local identity | Use once location comms are approved. |
| `klub-logo.*` | Brand mark | Create a master-logo record and ensure favicon/social use. |
| `public/images/og/*` if available | Social share cards | Map per page in SEO settings. |

### Videos

| File | Intended visual role | Migration handling |
|---|---|---|
| `cyprus-pool.mp4` | Founder/Cyprus lifestyle | Use a poster image, no audio autoplay. |
| `dubai-studio.mp4` | Teaching/experience credibility | Use with short loop and a fallback image. |
| `mat-home.mp4` | Movement texture | Below fold unless performance budget permits. |
| `online-studio.mp4` | PILATIZ/online studio story | Optional, only where story adds conversion value. |
| `studio-lounge.mp4` | Studio ambience | Hero or studio-story media after mobile test. |
| `studio-reformers.mp4` | Equipment credibility | Class / Studio page media. |
| `studio-tour.mp4` | Immersive space story | Do not force load on mobile if heavy. |

## 6. Design System Source Tokens

| Role | Hex / font | Current intended use |
|---|---|---|
| Warm linen | `#F7F3EE` | Global page background |
| White | `#FFFFFF` | Cards and clean sections |
| Sand | `#E8DFD3` | Soft contrast sections |
| Ink | `#1A1714` | Headlines / dark panels |
| Taupe | `#5C544C` | Secondary text |
| Warm grey | `#9A9088` | Low-emphasis labels |
| Umber | `#7A6A55` | Primary controls / accent |
| Deep umber | `#5C4F3D` | Primary hover |
| Hairline | `#E8E0D6` | Fine dividers |
| Heading font | DM Serif Display | Editorial headline / italic accent words |
| Body font | DM Sans | Body, labels, navigation, buttons |

## 7. Existing Interaction Inventory

| Interaction | Current implementation | Wix Studio / Headless equivalent | Note |
|---|---|---|---|
| Announcement banner | `Banner.astro` | Global top strip | Keep close/dismiss interaction only if it has a defined persistence rule. |
| Header/navigation | `Header.astro` | Global header / Astro component | Test mobile menu and anchor behavior. |
| Marquee | `Marquee.astro` | Studio animation/strip or CSS | Do not make essential content motion-only. |
| Book CTA | Static link currently | Native Bookings link/widget or headless redirect | Highest migration priority. |
| View timetable | Static link currently | Bookings schedule/availability | Use live operational data. |
| Founding form | `FoundingForm.astro` / Netlify Forms | Wix Form + Contacts/automation | Implement consent and test delivery. |
| WhatsApp fallback | `WhatsAppButton.astro` uses Instagram until number exists | Contact CTA | Keep fallback only until number is verified. |
| Arch video | `ArchVideo.astro` | Studio masked media or Astro component | Test mobile performance and crop. |

## 8. Source-to-Wix Content Ownership Map

| Content / feature | Owner after Headless | Owner after Studio rebuild | Do not do |
|---|---|---|---|
| Visual layout | Developer / Astro code | Content/design editor in Studio | Let operational staff change code unsafely. |
| Class operational schedule | Wix Bookings | Wix Bookings | Recreate live schedule manually in CMS. |
| Class editorial copy | Astro source or optional CMS | Wix CMS | Change structure ad hoc without review. |
| Pricing plans / package rules | Wix Bookings/Pricing Plans | Wix Bookings/Pricing Plans | Maintain inconsistent text and checkout price. |
| Policies | Approved source / static content | Approved source / static content | Change legal wording without owner. |
| Leads | Wix Forms/Contacts | Wix Forms/Contacts | Send marketing without consent. |
| Media master files | Secured repository/archive | Secured repository/archive | Treat Wix/website assets as only backup. |

## 9. Preservation Checklist

| Item | Preserve? | Method |
|---|---:|---|
| Existing public page paths | Yes | Match exact paths or create 301 redirects. |
| Current page titles and descriptions | Yes | Copy to Wix SEO/headless metadata. |
| Existing LocalBusiness schema | Yes, after address validation | Retain/refactor in headless or generate appropriate Wix schema. |
| OG cards | Yes | Upload/set page social images. |
| Image alt text | Yes, audit for accuracy | Map into CMS/Studio image settings. |
| Original photos/videos | Yes | Keep repository/archive master; upload derivatives. |
| Class copy and FAQ | Yes | Map to CMS/static pages with approved edits. |
| Founding-member wording | Yes, then legal/consent review | Build Wix Form + confirmation workflow. |
| Current CSS/Pixels | As reference | Screenshot/reference during Studio rebuild; retain in headless. |

## 10. Critical Open Decisions

1. Will KLUB’s primary website be an Astro headless site or a visual Wix Studio site?
2. Will Wix Bookings be the sole booking/checkout provider at launch?
3. What payment provider is available for the Cyprus business entity and which Wix tier supports it?
4. What are final price, VAT/tax, package validity, refund, cancellation/no-show and rollover terms?
5. Who can edit content, bookings, payments, marketing and publish code/site changes?
6. When can the exact address, phone and WhatsApp details become public?
7. Are all current media assets licensed/approved for commercial website use?
8. What will happen when a client wants a waitlist from the desktop site, given Wix’s mobile-app constraint?
