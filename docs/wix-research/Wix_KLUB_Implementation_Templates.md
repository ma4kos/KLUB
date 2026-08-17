# Wix KLUB Implementation Templates

**Use:** Copy the relevant template into the Wix build backlog or a development ticket. Replace every value in `<ANGLE_BRACKETS>` before implementation. Treat commercial values in this file as proposed configuration until confirmed by KLUB.

## 1. Site and Studio Templates

### Template 01 — Wix Project Brief

| Field | Value |
|---|---|
| Project name | KLUB Pilates Studio |
| Objective | Premium Pilates brand, lead capture before launch, class bookings, payments, member packages, private-session scheduling. |
| Audience | Limassol residents and international English-speaking clients; beginners through experienced reformer clients. |
| Primary CTA | Book your first class. |
| Secondary CTA | View timetable / join founding list. |
| Implementation choice | `<Headless Astro>` or `<Wix Studio rebuild>` |
| Launch domain | `<klub-cy.com>` |
| Booking operations owner | `<name and role>` |
| Content owner | `<name and role>` |
| Technical owner | `<name and role>` |
| Acceptance rule | Every CTA can be completed on a phone and test booking confirmation is received. |

### Template 02 — Wix Studio Theme Token Sheet

| Token | Value | Apply to |
|---|---:|---|
| `color.background` | `#F7F3EE` | Default page background |
| `color.surface` | `#FFFFFF` | Cards / white sections |
| `color.sand` | `#E8DFD3` | Soft editorial sections |
| `color.ink` | `#1A1714` | Headings / dark panels |
| `color.muted` | `#5C544C` | Secondary content |
| `color.accent` | `#7A6A55` | Primary CTA / highlights |
| `color.accentHover` | `#5C4F3D` | CTA hover state |
| `color.border` | `#E8E0D6` | Dividers / fine borders |
| `font.display` | DM Serif Display | Headings |
| `font.body` | DM Sans | Paragraphs / UI |
| `radius.card` | 18px | Cards |
| `radius.cta` | 999px | Buttons |

### Template 03 — Page-to-Section Rebuild Blueprint

| Page | Section sequence | CMS? | Booking component? |
|---|---|---:|---:|
| Home | Hero → ticker → brand proof → studio story → classes → founder → pricing teaser → location → founding form | Class teaser only | CTA links |
| About | Editorial hero → studio media → beliefs → CTA | No | CTA link |
| Classes | Intro → dynamic class cards → guidance CTA | Yes | Service links |
| Class detail | Hero → description → expectations → suitability → preparation → booking CTA | Yes | Service link |
| Pricing | Intro → packages → memberships → private pricing → policy FAQ | Optional | Plan / service links |
| Timetable | Intro → live booking schedule → founding CTA | No | Native Bookings widget or headless availability UI |
| Instructors | Founder profile → credentials → story → CTA | Optional | CTA link |
| FAQ | Category filters → FAQ accordions → contact CTA | Optional | No |
| Location | Address / map → arrival guidance → CTA | No | No |
| Contact | Form → direct links → location summary | No | No |
| Founding Member | Value promise → founding benefits → lead form | No | No |
| Policies | Arrival / cancellation / package / privacy rules | No | No |

### Template 04 — Responsive QA Matrix

| Viewport | Test | Pass condition |
|---|---|---|
| 1440px desktop | Header, hero grid, CTA row, card grid | No unintended overlap; headline and media hold the intended editorial balance. |
| 1024px tablet landscape | Navigation, marquee, pricing cards | Cards reduce cleanly and no navigation item wraps unpredictably. |
| 768px tablet portrait | Header/menu, media arches, anchor navigation | All tap targets remain reachable without horizontal scroll. |
| 390px mobile | Hero, CTAs, timetable, booking CTA | Primary CTA appears above the fold; no clipped text; all fields usable. |
| 320px narrow mobile | Forms, pricing table, FAQ | No horizontal page scroll; tab/focus navigation remains logical. |

### Template 05 — Asset Upload Manifest

| Asset role | Existing source | Wix / Headless action | Notes |
|---|---|---|---|
| Logo | `public/images/klub-logo.jpg` | Upload a high-quality raster and separately retain an SVG if created later | Use clear safe-space around mark. |
| Studio images | `public/images/*.jpg` and `.webp` | Upload JPG sources to Wix Media Manager; retain WebP in code-first route | Maintain descriptive alt text. |
| Founder photos | `public/images/izzy-*.jpg` | Upload and map by editorial section | Confirm usage rights before replacing crops. |
| Video loops | `public/videos/*.mp4` | Upload/host in Wix or preserve code assets | Do not autoplay with sound. Provide poster images. |
| Social previews | `public/images/og/*` if present | Set per-page social-share image | Use 1200×630 variants. |
| Fonts | `public/fonts/*` | Use Wix font selection if available; otherwise license/upload only if permitted | Do not assume a font upload license. |

## 2. CMS Templates

### Template 06 — `Classes` CMS Collection Schema

| Field key | Field type | Example / validation | Editor rule |
|---|---|---|---|
| `title` | Text | `Reformer Fundamentals` | Required; 80 chars max. |
| `slug` | Text | `reformer-fundamentals` | Required; unique; URL-safe. |
| `summary` | Text | Beginner-facing 1–2 sentence summary | Required; 220 chars max. |
| `body` | Rich content | Long-form description | Required. |
| `heroImage` | Image | Studio or equipment image | Required; descriptive alt text in adjacent field. |
| `imageAlt` | Text | `Black reformer Pilates springs...` | Required. |
| `durationMinutes` | Number | `50` | Required; display unit separately. |
| `capacity` | Number | `6` | Required for class; blank for private appointment. |
| `audience` | Tags | `Beginner`, `Returner` | Optional. |
| `intensity` | Text | `Introductory` | Optional. |
| `goodToKnow` | Rich content | Attire and arrival information | Required. |
| `bookingServiceId` | Text | `<Wix Bookings service ID>` | Required after booking setup. |
| `isPublished` | Boolean | `true` | Filter false until ready. |
| `sortOrder` | Number | `10` | Use increments of ten. |

### Template 07 — `StudioProfile` Singleton Collection

| Field key | Value at launch |
|---|---|
| `studioName` | KLUB Pilates Studio |
| `shortName` | KLUB |
| `tagline` | Intentional Movement. Mindful Strength. Real Connection. |
| `email` | team@klub-cy.com |
| `instagramUrl` | https://www.instagram.com/klubstudios |
| `phoneDisplay` | `<confirmed number>` |
| `whatsappNumberE164` | `<digits only>` |
| `openingLabel` | Opening September 2026 |
| `openingDate` | 2026-09-01 |
| `streetAddress` | `<confirmed address>` |
| `addressLocality` | Limassol City Center |
| `addressCountry` | Cyprus |

### Template 08 — CMS Import CSV Header

```csv
slug,title,summary,durationMinutes,capacity,intensity,audience,isPublished,sortOrder,bookingServiceId
reformer-fundamentals,Reformer Fundamentals,"Perfect for beginners. Learn the machine, master the basics, build confidence.",50,6,Introductory,"Beginner;Returner",true,10,<SERVICE_ID>
reformer-flow,Reformer Flow,"Smooth, continuous movement for those ready to build stamina and grace.",50,6,Intermediate,"Experienced beginner;Regular",true,20,<SERVICE_ID>
reformer-power,Reformer Power,"Intensified resistance, dynamic sequences for the experienced mover.",50,6,Advanced,"Experienced",true,30,<SERVICE_ID>
private-sessions,Private Sessions,"Training tailored to your body, your goals and your schedule.",50,,Personalized,"All levels",true,40,<SERVICE_ID>
```

### Template 09 — Dynamic Class Page Binding Specification

| Element | Bind to | Fallback |
|---|---|---|
| H1 | `title` | Do not publish missing title. |
| Hero image | `heroImage` | Use a neutral studio image. |
| Hero alt text | `imageAlt` | Use accurate descriptive alt text. |
| Intro paragraph | `summary` | Do not truncate beyond intent. |
| Long copy | `body` | Use rich content. |
| Facts row | `durationMinutes`, `capacity`, `intensity` | Hide blank private capacity. |
| Book CTA | `bookingServiceId` | Route to `/book` and explain availability. |
| Related link | Next active `sortOrder` item | Hide if no item. |

### Template 10 — Founding Member Lead Record

| Field | Data type | Required | Notes |
|---|---|---:|---|
| `firstName` | Text | Yes | Use confirmation-friendly form labels. |
| `email` | Email | Yes | Validate and deduplicate. |
| `phone` | Telephone | No | Store only if messaging consent is clear. |
| `interest` | Multiple choice | No | `Morning`, `Lunchtime`, `Evening`, `Private`. |
| `marketingConsent` | Checkbox | Yes for marketing | Do not pre-select. |
| `submittedAt` | System timestamp | System | Do not permit public editing. |
| `source` | Text | System | `website-founding-form`. |

## 3. Wix Bookings Templates

### Template 11 — Group Class Service

| Setting | Value |
|---|---|
| Service type | Class |
| Service name | `<Reformer Fundamentals / Flow / Power>` |
| Duration | 50 minutes |
| Capacity | 6 |
| Location | `<KLUB exact address>` |
| Staff member | `<Izzy / assigned instructor>` |
| Price mode | `<Single session, package eligible, membership eligible>` |
| Booking form | Standard profile + `injury/pregnancy notes` only if operationally necessary |
| Policy | `KLUB Group Class — 12 Hour` |
| Client copy | “Please arrive 10 minutes early for your first visit. Grip socks are required.” |

### Template 12 — Private Session Service

| Setting | Value |
|---|---|
| Service type | Appointment |
| Service name | Private Sessions |
| Duration | 50 minutes |
| Capacity | 1 |
| Location | `<KLUB exact address>` |
| Staff | `<Izzy / assigned instructor>` |
| Availability | Define working hours, buffers and lead time |
| Price options | Single €80, 5-pack €375, 10-pack €700 — **confirm before activation** |
| Booking form | Contact, goal, relevant non-sensitive preparation question |
| Policy | `KLUB Private — 12 Hour` |

### Template 13 — Group Booking Policy

| Rule | Proposed value | Decision owner |
|---|---|---|
| Policy name | KLUB Group Class — 12 Hour | Operations owner |
| Booking opens | `<e.g., 14 days before session>` | Operations owner |
| Booking closes | `<e.g., 30 minutes before session>` | Operations owner |
| Customer cancellation | Allowed until 12 hours before start | Operations owner |
| Customer reschedule | `<same or stricter than cancellation>` | Operations owner |
| Card on file | `<Yes/No>` | Finance owner |
| Cancellation / no-show fee | `<Define policy>` | Finance + legal owner |
| Group participants per booking | `<1 by default>` | Operations owner |
| Waitlist | Enable after mobile-app restriction accepted | Operations owner |
| Client copy | “Cancel at least 12 hours before your session to return your credit.” | Content owner |

### Template 14 — Package Plan

| Field | Example |
|---|---|
| Plan name | Intro Pack — 2 Reformer Classes |
| Price | €32 — **confirm before activation** |
| Sessions | 2 |
| Eligible services | Reformer Fundamentals, Flow, Power |
| Eligibility | New clients only; enforcement method must be tested |
| Validity | `<e.g., 30 days>` |
| Sharing | Not permitted |
| Sales window | `<pre-launch / permanent>` |
| Client copy | “Two classes to meet the machine, find your rhythm and feel the difference.” |

### Template 15 — Membership Plan

| Field | Example |
|---|---|
| Plan name | 8 Classes / Month |
| Renewal | Monthly recurring payment |
| Price | €200 — **confirm before activation** |
| Included sessions | 8 eligible group classes per billing period |
| Eligible services | Reformer Fundamentals, Flow, Power |
| Carryover | `<Yes/No>` |
| Cancellation terms | `<legal / business decision>` |
| Billing notice | `<number of days>` |
| Client copy | “A twice-weekly rhythm for stronger, steadier movement.” |

### Template 16 — Calendar Test Script

| Scenario | Steps | Expected result |
|---|---|---|
| Capacity guard | Book six participants into the same class | A seventh standard booking cannot be confirmed. |
| Cancellation window | Cancel 13 hours before start | Credit/policy outcome follows stated rule. |
| Late cancellation | Cancel 10 hours before start | System applies stated late-cancel outcome. |
| Package redemption | Buy intro pack, book two allowed sessions | Eligibility and balance decrement correctly. |
| Private session | Book an available appointment, then re-open time picker | Slot no longer appears available. |
| Time zone | Book from a Cyprus device and an overseas device | Session time remains correctly represented. |

## 4. Headless and Developer Templates

### Template 17 — Existing Astro Link Readiness

| Check | Expected state | KLUB current status |
|---|---|---|
| Node.js | 20.11+ | Available in project environment; verify developer machine. |
| Astro version | 5.x supported by current Wix existing-project guide | **Upgrade required** from Astro 4.16.18. |
| Astro config | `astro.config.mjs` present | Present. |
| Wix link config | No existing `wix.config.json` before first link | Verify in branch. |
| Git safety | New POC branch / clean working tree | Required. |
| Regression build | Existing static build passes before migration | Required. |

### Template 18 — Wix-managed Headless Link Command

```bash
# Run only from a clean, dedicated proof-of-concept branch after Astro 5 regression testing.
npm create @wix/new@latest -- headless link

# Then validate the locally configured project.
npm run dev
```

### Template 19 — Headless Booking Service Discovery (Illustrative)

```ts
// Run only after the Wix headless project has supplied its configured SDK client.
// Do not place secrets or privileged credentials in this file.
import { wixClient } from "./wix-client";

export async function listKlubServices() {
  const result = await wixClient.services.queryServices({
    query: {
      filter: { status: "ACTIVE" }
    }
  });

  return result.items.map((service) => ({
    id: service._id,
    name: service.name,
    slug: service.mainSlug?.name,
    serviceType: service.type,
    description: service.description,
  }));
}
```

### Template 20 — Headless Class Availability (Illustrative)

```ts
// Use the event-time-slots method for class events and pass the business time zone.
// Revalidate the selected slot immediately before creating a booking.
export async function getClassSlots(serviceId: string, start: string, end: string) {
  const result = await wixClient.eventTimeSlots.listEventTimeSlots({
    serviceId,
    fromLocalDate: start,
    toLocalDate: end,
    timeZone: "Asia/Nicosia",
    openSpots: 1,
  });

  return result.timeSlots ?? [];
}
```

### Template 21 — Secure Booking Redirect (Illustrative)

```ts
// Use Wix-managed checkout in the initial release. Only redirect to Wix domains
// registered in the project's permitted redirect configuration.
export async function beginWixBookingCheckout(slotAvailability: unknown, currentUrl: string) {
  const redirect = await wixClient.redirects.createRedirectSession({
    bookingsCheckout: {
      slotAvailability,
      timezone: "Asia/Nicosia",
    },
    callbacks: {
      postFlowUrl: currentUrl,
    },
  });

  return redirect.redirectSession.fullUrl;
}
```

### Template 22 — Booking Event Handler Contract

| Event | Trigger action | Idempotency key | Failure treatment |
|---|---|---|---|
| Booking created | Append internal audit record | Booking ID + event name | Retry safely; do not charge. |
| Booking confirmed | Send internal notification / CRM tag | Booking ID + `confirmed` | Do not duplicate email/SMS. |
| Booking canceled | Update client status / release resource if external | Booking ID + `canceled` | Log status and payload version. |
| Payment approved | Attribute revenue/conversion | Order ID | Reconcile with booking ID. |
| Form submitted | Add opted-in founding member to marketing segment | Email + form submission ID | Do not market without recorded consent. |

### Template 23 — API Secret Handling Rule

> **Rule:** Public browser code may contain a public client identifier when documentation allows it, but it must never contain OAuth client secrets, Wix API keys, payment keys, admin tokens, or write-capable credentials. Keep privileged calls in Wix-managed backend/extensions or another secured server environment.

### Template 24 — Custom Booking Go/No-Go Gate

| Question | Proceed only when the answer is yes |
|---|---|
| Native widget flow complete? | The native Wix Bookings flow works for every KLUB service. |
| Booking form fields agreed? | Required fields are minimally necessary and approved. |
| Availability revalidation tested? | Two simultaneous test users cannot silently overbook normal capacity. |
| Checkout path chosen? | Wix-managed checkout is preferred or custom checkout has finance/legal sign-off. |
| Failure state designed? | Full, expired, payment-failed, double-booking and network-failed states are handled. |
| Observability ready? | Booking and error events can be identified without exposing personal data. |

## 5. SEO, Content, and Governance Templates

### Template 25 — SEO Page Record

| Field | Example |
|---|---|
| Path | `/classes/reformer-fundamentals/` |
| Title | Reformer Fundamentals Class \| Beginner Pilates Limassol \| KLUB |
| Meta description | Never tried reformer Pilates? Our Fundamentals class in Limassol teaches you the machine from zero. 50 minutes, max 6 people, taught in English. First class €20. |
| Canonical URL | `https://<production-domain>/classes/reformer-fundamentals/` |
| OG title | Same as title unless shorter copy improves social share. |
| OG image | `<media URL or asset>` |
| Indexing decision | Index |
| Previous URL | `<old source path>` |
| Redirect required | `<Yes / No>` |

### Template 26 — Redirect Inventory

```csv
old_path,new_path,redirect_type,reason
/,/,none,Same home route
/about/,/about/,none,Same route
/classes/reformer-fundamentals/,/classes/reformer-fundamentals/,none,Same route
/book/,/book/,none,Same route
/founding-member/,/founding-member/,none,Same route
```

### Template 27 — Pre-Launch Editorial Checklist

| Check | Owner | Status |
|---|---|---|
| Exact studio address inserted and checked | Content owner | `<Not started>` |
| WhatsApp/phone details confirmed | Operations owner | `<Not started>` |
| Every price and expiry validated | Finance owner | `<Not started>` |
| Instructor credentials approved | Founder | `<Not started>` |
| Photo/video usage rights checked | Founder | `<Not started>` |
| Health-related copy reviewed | Founder + appropriate professional | `<Not started>` |
| Privacy and cancellation policies reviewed | Legal / business owner | `<Not started>` |
| Greek/English local wording checked if needed | Content owner | `<Not started>` |

### Template 28 — Performance Acceptance Criteria

| Area | Requirement |
|---|---|
| Largest hero media | Use an intentional desktop/mobile strategy; no unnecessary full-resolution video download. |
| Images | Size each image to display dimensions; preserve alternate text. |
| Data | Fetch only the fields and items used by each page; use pagination for large lists. |
| Booking UI | Show loading/empty/error states; no false available slot claims. |
| Custom code | Avoid a client-side dependency for simple CSS/Studio features. |
| Third parties | Add only tools with a clear owner and measurable purpose. |

### Template 29 — Roles and Access Matrix

| Role | Wix access | GitHub access | Permitted actions |
|---|---|---|---|
| Site owner | Full owner | Admin | Billing, domain, app install, publish, approvals. |
| Operations manager | Bookings and contacts | None | Calendar, participants, plan reviews, cancellation management. |
| Content editor | CMS/content | None | Approved copy, images, dynamic class records. |
| Developer | Velo/headless project | Write PRs | Code, previews, non-production tests. |
| Marketing collaborator | Forms/automations/analytics | None | Campaigns and lead segmentation; no site publish. |

### Template 30 — Go-Live Sign-Off

| Approval | Name | Date | Evidence |
|---|---|---|---|
| Brand/design parity | `<owner>` | `<date>` | Desktop/mobile review link |
| Booking rules | `<owner>` | `<date>` | Test booking evidence |
| Payments | `<owner>` | `<date>` | Test transaction/refund process |
| SEO/redirects | `<owner>` | `<date>` | Crawl / redirect checks |
| Privacy and legal copy | `<owner>` | `<date>` | Approved policy link |
| Analytics | `<owner>` | `<date>` | Test event evidence |
| Production publish | `<owner>` | `<date>` | Release ID / release log |

## Sources for Template Assumptions

The use of dynamic CMS pages, collection permissions, datasets and app collections is documented by Wix CMS. [1] Wix describes Bookings service types, capacity/policy controls, booking flow revalidation, pricing plans and API surfaces in its Help Center and Developer documentation. [2] [3] [4] The existing-Astro headless linking and Studio responsive-editor capabilities are current Wix-documented paths. [5] [6]

## References

[1]: https://support.wix.com/en/article/cms-content-management-system-an-overview "CMS: An Overview — Wix Help Center"
[2]: https://support.wix.com/en/article/wix-bookings-setting-up-your-booking-policies "Wix Bookings Policies — Wix Help Center"
[3]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/introduction "About Wix Bookings — Wix Developers"
[4]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/flow-single-service-booking "Single-Service Booking Flow — Wix Developers"
[5]: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project "Connect an Existing Astro Project — Wix Developers"
[6]: https://support.wix.com/en/article/wix-studio-about-the-studio-editor "Wix Studio: About the Studio Editor"
