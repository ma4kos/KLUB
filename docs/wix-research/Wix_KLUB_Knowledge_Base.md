# Wix Knowledge Base and KLUB Migration Guide

**Version:** 1.0  
**Prepared for:** KLUB Pilates Studio / Markos  
**Prepared by:** Manus AI  
**Scope:** Comprehensive, implementation-oriented Wix reference for moving the current Astro/GitHub Pages KLUB website into the Wix ecosystem.

> **Core answer:** Wix does **not** turn an external Astro/HTML/CSS repository into editable Wix Studio canvas pages. For KLUB, the viable routes are: a native Wix Studio rebuild; keep the code and use Wix only for bookings; preserve the Astro code while connecting and hosting it as a Wix-managed headless project; or keep hosting independently and use Wix Headless APIs. Because KLUB already uses Astro, **Wix-managed Headless + Wix Bookings** is the closest way to get the existing website “into Wix” without a visual rebuild. [1] [2]

---

## 1. Quick Start: Choose a Wix Route

Use this decision table before creating anything in Wix. The choice determines who owns layout, how updates are made, what must be rebuilt, and how much integration code is required.

| Route | Keeps current KLUB layout/code? | Has visual MYSIWYG page editing? | Wix bookings/payments? | Best use |
|---|---:|---:|---:|---|
| **Wix Studio rebuild** | No; rebuild manually | Yes | Yes | Staff need to independently edit page design and copy. |
| **Hybrid: Astro site + Wix Bookings** | Yes | No for Astro page; yes for booking site | Yes | Fastest path to operational bookings while preserving the current site. |
| **Wix-managed Headless + Astro** | Yes, after supported-version migration | No for the Astro layout; Wix dashboard manages business | Yes | Best balance of custom design and Wix operations. |
| **Self-managed Headless** | Yes | No | Yes | Retain GitHub Pages/Netlify/Cloudflare or any other host as a hard requirement. |
| **Standard Wix Editor rebuild** | No; rebuild manually | Yes | Yes | Simple brochure site with modest custom-design requirements. |

### Recommended KLUB Sequence

Start **Wix Bookings configuration** and a **Wix-managed Headless proof of concept** in parallel. Do not retire the live Astro site until a test client can view a class, choose a slot, pay or apply a package, receive a confirmation, cancel under the stated rule, and see the correct outcome. The repository currently uses Astro 4.16.18, while Wix’s existing-Astro linking guide requires Astro 5 and a project not already linked through `wix.config.json`; therefore, use a dedicated branch for the upgrade and connection proof. [1]

If the business needs bookings today and the technical proof takes longer, link the current Book Now buttons to the Wix Bookings site/page as an interim solution. This retains the existing design and lets the team validate operations before moving hosting or rebuilding pages.

---

## 2. KLUB Site Audit and Migration Fit

### 2.1 Current website architecture

The KLUB website is an Astro static site deployed to GitHub Pages. Its repository has shared studio configuration in `src/site.ts`, class catalogue data in `src/data/classes.ts`, class detail data, reusable Astro components, global CSS, static page routes, and image/video assets in `public/`. It currently includes home, about, book, contact, FAQ, founding member, instructors, location, policies, pricing, timetable and four class detail routes.

| Current element | Current source | Best Wix equivalent | Migration method |
|---|---|---|---|
| Studio facts | `src/site.ts` | CMS singleton / Wix site settings / code config | Migrate only if a Studio rebuild needs staff-managed facts. |
| Class catalogue | `src/data/classes.ts` | Wix CMS `Classes` collection | Use dynamic pages in Studio, or retain in code/headless. |
| Class pages | `src/pages/classes/[slug].astro` | Wix CMS dynamic item page | Build one template bound to `Classes`. |
| Page components | `src/components/` | Global sections, saved Studio sections, Velo only when essential | Manually recompose in Studio. |
| Design system | `src/styles/global.css` | Studio global classes + custom CSS, or retain CSS in Astro | Translate tokens; do not copy arbitrary DOM CSS into Studio. |
| Lead forms | Astro/Netlify Forms components | Wix Forms / CMS collection / CRM contacts | Rebuild securely and configure consent. |
| Booking placeholder | Static `/book/` page | Wix Bookings native page, widget or headless flow | Add native service configuration first. |
| SEO/schema | Astro layout and per-page content | Wix SEO panel / headless metadata | Preserve title, description, canonical, social image and route mappings. |

### 2.2 Existing operating assumptions to confirm

The present site copy contains proposal-level business values. Do not activate pricing or payments until the business owner confirms these values. The current concept includes 50-minute services, group capacity of six, a 12-hour cancellation window, three group classes, private sessions, a €20 drop-in, €32 intro pack, memberships, flexi packs and private-session packs. Confirm final price, validity, renewal, eligibility, refund, cancellation-fee and tax handling.

| Item | Existing proposed value | Must confirm before launch |
|---|---:|---|
| Group capacity | 6 people | Equipment count and operational capacity. |
| Group duration | 50 minutes | Include cleaning/turnover buffer in the timetable. |
| Private duration | 50 minutes | Staff availability and buffer. |
| Cancellation window | 12 hours | Exact credit, fee and no-show outcome. |
| Intro pack | €32 / 2 classes | New-client enforcement, expiry and eligible class types. |
| Private price | €80 single; packs listed | Final commercial terms and taxes. |
| Address / WhatsApp | Not yet set in source | Exact address and E.164 number. |
| Opening date | September 2026 | Announcement / public booking date. |

---

## 3. Wix Platform Map: Visual, No-Code, and Code-First Options

### 3.1 Wix Editor, Wix Studio, Velo, and Headless

**Wix Editor** is the standard visual site builder. It is suitable when fast visual editing matters more than advanced responsive composition. **Wix Studio** is Wix’s professional editor, aimed at more exact responsive design, collaboration and development workflows. It supports responsive behaviors, grids, stacks, reusable assets/sections, animations, code-free CMS connections, custom CSS and breakpoint-specific design overrides. [3] [4]

**Velo** is the code extension layer for Wix websites. It offers front-end and back-end JavaScript, site/editor element APIs, data APIs, web methods, automations, npm package support, routers, integrations and access to Wix business solutions. Use Velo for meaningful custom behavior, not for routine layout that Studio can handle directly. [5]

**Wix Headless** separates the visitor-facing frontend from Wix’s business-management platform. It lets a custom site use Wix business APIs and Wix’s back office for bookings, payments, commerce, contacts, CMS and operations. Wix supports a managed Astro path and a self-managed path. [2]

### 3.2 Wix Studio: recommended visual-editor route

Wix Studio is the correct MYSIWYG choice for KLUB if non-developers must later move sections, change layouts or create pages in a drag-and-drop visual interface. It is capable of recreating most of KLUB’s aesthetic: editorial typography, warm palette, grid-based layout, rounded cards, arch-masked media, scroll/hover/entrance animation, responsive breakpoints, tables, forms and CMS data lists. [3]

> **Important distinction:** Studio can be visually precise, but it is a manual reconstruction. It cannot simply import `src/`, Astro components, CSS files or an existing GitHub Pages website and convert them to Studio elements.

Studio begins with three default breakpoints—desktop (1001px+), tablet (751–1000px) and mobile (320–750px)—and permits up to three additional breakpoints. Larger-breakpoint styling cascades downward; smaller-breakpoint design and layout overrides do not affect larger breakpoints. However, content/data changes, replacements, deletion and hierarchy changes can apply across all breakpoints. [4]

### 3.3 Studio templates and blank canvas

Wix Studio provides predesigned templates and a blank-canvas route. Templates are useful for fast foundations, but their benefit for KLUB is limited because KLUB already has a strongly defined information architecture and brand system. Use **Blank Canvas** or a minimal template as a scaffold, then recreate KLUB’s section hierarchy. Wix Studio templates are customizable and include sample content/design/business features; Studio also permits saved custom templates for future projects. [6]

### 3.4 Standard Wix Editor

Use the standard Wix Editor when the priority is a simpler visual builder with a smaller team and lower demand for custom responsive behavior. For KLUB, Studio is generally better because the existing visual identity includes asymmetrical editorial layouts, media arches, carefully controlled spacing and mobile-specific behavior.

### 3.5 Wix Studio site code and Git integration

A native Wix Studio site can use Wix’s Git Integration and Wix CLI for Sites. Wix sets up a Wix site code repository, allows IDE development and local editor testing, and supports preview/publish through Wix tooling. This is beneficial after choosing the Studio route, but it does not transform an unrelated Astro repository into a Studio site. [7]

---

## 4. Core Wix Capabilities and Offerings

Wix combines visual site-building, content, business applications and developer tooling. Its exact plan/app availability varies by territory and product changes over time; treat the logged-in Wix dashboard/checkout as the final authority for local eligibility and billing.

| Capability family | Native Wix offering | KLUB relevance | Preferred implementation |
|---|---|---|---|
| Site design | Wix Editor, Wix Studio, templates, blank canvas, responsive layout tools | High | Studio if rebuilding; Astro if preserving code. |
| Content | Wix CMS collections, datasets, repeaters, dynamic pages, SEO fields | High | `Classes` dynamic pages and optional FAQ/instructor content. |
| Lead capture | Wix Forms, contacts, automations | High | Founding member form / contact form. |
| Appointments & classes | Wix Bookings | Critical | Services, schedules, capacity, policies, client records. |
| Plans / recurring revenue | Pricing Plans + Bookings packages/memberships | Critical | Intro pack, flexi packs, memberships, private packs. |
| Payments / checkout | Wix Payments or eligible providers + eCommerce checkout | Critical | Test Cyprus eligibility before commercial activation. |
| Contacts / members | Contacts, Members Area, member experiences | High | Booking history, rescheduling/rebooking, package management. |
| Email/SMS/notifications | Booking notifications, automations, marketing suite | High | Confirmations, reminders, founding launch messages. |
| Calendar | Booking calendar and personal/external calendar connectivity | High | Staff availability and class timetable. |
| SEO | Page SEO, dynamic-page SEO, social share images, metadata | High | Preserve present local-search targeting. |
| Analytics | Site analytics and managed headless analytics | Medium | Measure booking CTA and lead conversion. |
| eCommerce | Stores, products, cart, checkout, orders, discounts | Optional | Future grip-socks / merchandise shop. |
| Events | Wix Events, ticketing, RSVPs | Optional | Workshops or launch events. |
| Blog | Wix Blog APIs/content | Optional | Pilates education / local SEO content. |
| Restaurants | Restaurant, menus, orders/reservations | Not relevant | Exclude. |
| Donations | Donation campaigns | Not relevant | Exclude. |
| Portfolio | Portfolio collections/projects | Not relevant | Exclude. |
| Apps / marketplace | Public/private apps, extensions, plugins | Conditional | Only when a native tool cannot satisfy a defined requirement. |

Wix’s unified API reference currently exposes business-solution categories including eCommerce, Stores, Bookings, Meetings, CMS, Events, Restaurants, Blog, Forum, Pricing Plans, Portfolio, Donations, Suppliers Hub and Gift Cards. That reference is a better technical catalog than marketing pages when deciding whether a feature can be integrated programmatically. [8]

---

## 5. Wix Bookings for a Pilates Studio

### 5.1 What Wix Bookings covers

Wix Bookings allows clients to book and pay for in-person or online services. Its Help Center describes service scheduling, online/offline payment options, memberships and packages, multiple locations, calendar management, booking forms, client email/SMS notices and booking history. [9]

For KLUB, map services as follows:

| KLUB offering | Wix Bookings type | Reason |
|---|---|---|
| Reformer Fundamentals | **Class** | Recurring group session with scheduled time and capacity. |
| Reformer Flow | **Class** | Recurring group session with scheduled time and capacity. |
| Reformer Power | **Class** | Recurring group session with scheduled time and capacity. |
| Private Sessions | **Appointment** | 1-to-1 availability based on instructor working time. |
| Future 6/8-week programme | **Course** | Multi-session program booked as a whole. |

Wix’s developer documentation defines appointments as on-demand time-slot bookings, classes as scheduled sessions customers join individually, and courses as multi-session programs booked in full. [10]

### 5.2 Services, capacity, staff, rooms and equipment

Configure each group class with duration, price, capacity, schedule, instructor, location and booking policy. Wix Bookings supports resources for physical assets such as rooms/equipment and staff members with working hours. For basic KLUB operations, define the studio as the location and owner/instructor as staff. Add physical resources only when there is a real need to prevent conflicts among multiple rooms, reformers or independently bookable equipment. [11]

Do not model the live timetable in a separate CMS table and assume it is authoritative. **Wix Bookings must own schedule, availability, booking state and capacity**, while the CMS should own editorial content such as long descriptions, images, FAQs and landing-page sections. This avoids a stale timetable showing bookable slots that are unavailable.

### 5.3 Booking policies

Wix Booking Policies can specify when clients can book, cancel or reschedule; can allow group bookings; can require stored payment details; can charge cancellation/no-show fees; can set booking windows; and can configure class waitlist behavior. Rules may vary by service. [12]

A strong starting policy for KLUB group services is: book from 14 days before the session until 30 minutes beforehand; cancel up to 12 hours beforehand; reschedule under the same or a slightly stricter rule; capacity six; and no-show/cancellation fees only after legal/commercial sign-off. These are operating recommendations, not platform constraints.

### 5.4 Packages and memberships

Wix packages are prepaid bundles of a set number of sessions. Memberships are recurring pricing plans that grant access to selected services for a defined billing period. The Booking Help Center describes recurring packages as possible and recommends using a Members Area for customers to review/rebook/reschedule and manage subscriptions. Packages/memberships are not currently offered for courses, so only use them for KLUB classes/appointments, not a future course product. [13]

| KLUB candidate plan | Wix pattern | Data to decide |
|---|---|---|
| Drop-in €20 | Individual paid booking | Refund/cancel treatment. |
| Intro Pack €32 / two | Package | New-client restriction and expiry. |
| 4/month €120 | Membership or recurring package | Rollover, renewal/cancel terms. |
| 8/month €200 | Membership or recurring package | Rollover, renewal/cancel terms. |
| Unlimited €280 | Membership | Fair-use/booking limits. |
| 5-class €110 | Package | Two-month expiry. |
| 10-class €200 | Package | Three-month expiry. |
| Private 5/10 pack | Package | Eligible service and expiry. |

### 5.5 Waitlist restriction

Wix supports class waitlists, but the current Help Center states that customers can only join these waitlists via Wix mobile apps; they cannot join through typical website/desktop booking widgets. The team can manually add waitlist customers through the dashboard. [14]

> **KLUB design implication:** Do not promise a website waitlist unless the implementation is tested. Either explain “join the waitlist in the KLUB mobile experience,” offer a simple notification-interest form, or manage leads manually until a web-native alternative is built.

### 5.6 Booking form and health data

Wix Bookings forms can collect client information. For a Pilates studio, use only necessary booking data: name, email, mobile number, consent and an optional short “Anything your instructor should know before class?” message. Do not place health, pregnancy, injury or medical data in a public CMS collection. Avoid collecting sensitive data without a defined purpose, access policy, retention period and appropriate legal/privacy review.

### 5.7 Payments and plan prerequisite

Wix states that Bookings can be added at no cost, but an upgraded site plan is required to accept bookings; it likewise says a plan upgrade is required to accept online payments. [9] A fully free Wix site is therefore appropriate for visual setup/testing only, not commercial KLUB booking operations.

---

## 6. Wix CMS: Content Models and Dynamic Pages

### 6.1 CMS fundamentals

The Wix CMS stores content in collections separate from the editor. Connected elements—repeaters, galleries, tables and forms—can display collection fields dynamically. Dynamic pages use a shared layout to create unique URLs for each record, while CMS settings can control permissions, imports/exports, sandbox/live data and SEO. [15]

For KLUB, use CMS when the content is editorial, repeatedly structured and likely to change. Use native Bookings when the content is operational and transaction-related.

| Domain | Source of truth | Reason |
|---|---|---|
| Class marketing copy, photo, class suitability | `Classes` CMS collection | Easy editorial update and dynamic route reuse. |
| Founder profile | Static Studio content or `Instructors` CMS | Static for one profile; CMS if multiple instructors are expected. |
| FAQ | Static accordions or CMS collection | CMS only if categories and updates will be frequent. |
| Price marketing table | Static content linked to Bookings | Avoid duplicating operational price logic. |
| Availability and session times | Wix Bookings | System must reflect real booking state. |
| Client bookings, attendance and package balances | Wix Bookings / app collections | Not manually editable CMS content. |
| Founding leads | Wix Forms/Contacts | Marketing consent and CRM process. |

### 6.2 KLUB CMS schema

The recommended `Classes` collection contains a title, slug, summary, rich body, hero image, alt text, duration, capacity, intensity, audience tags, preparation content, publish flag, sort order and Wix Bookings service ID. The exact schema and ready-to-import CSV are in `Wix_KLUB_Implementation_Templates.md`.

Use a single dynamic item template for URLs such as `/classes/reformer-fundamentals/`. Use a dynamic list page for `/classes/`. Wix notes that dynamic pages can generate URLs for collection items without consuming an additional page per record; it publishes a total Wix site page quota of 298, including up to 100 static pages. [15]

### 6.3 CMS restrictions and scale limits

CMS capacity depends on the selected plan. Current published limits are 1,500 items for Light, 4,000 for Core, 20,000 for Business, and 10,000,000 for Business Elite/Elite. Light/Core/Business have 10 GB total database storage; Business Elite/Elite have 100 GB. Wix app collections—including Bookings—do not count toward that item/storage quota, while private app collections do. Individual non-media item data is capped at 512 KB. [16]

KLUB’s content requirements are far below any paid plan’s CMS limit. The relevant constraints are quality and performance, not item count: avoid oversized rich-text items, large repeated queries, duplicate booking data and unnecessary custom database writes.

### 6.4 CMS performance rules

Wix recommends retrieving only required items/fields, filtering early, using paging/load-more patterns, using dynamic pages for data-rendered pages, performing bulk writes and adding indexes to commonly searched/sorted fields. [17] This is particularly important if the site later adds a large article library, member directory or class archive.

---

## 7. Plans, Tiers and Commercial Selection

### 7.1 Current published plan families

Wix currently describes four major plan families: **Light, Core, Business and Business Elite**. All published premium plans include a custom domain and removal of Wix branding; exact features, limits, currencies, promotions and price vary by country/billing period and must be checked in the Wix checkout for the specific site. [18]

| Tier | Wix’s published positioning | KLUB fit |
|---|---|---|
| Light | Basic online presence | Not suitable for accepting payment online. |
| Core | Selling products/services and payment processing | Possible launch tier if all booking needs are available. |
| Business | More robust business features / growth | Strong default comparison point for KLUB. |
| Business Elite | Higher traffic/advanced functionality/custom API positioning and higher CMS capacity | Unnecessary at initial KLUB scale unless evidence shows a need. |

### 7.2 Practical KLUB plan recommendation

Compare **Core** and **Business** in the authenticated Cyprus checkout, starting with the lowest tier that supports the exact booking, payment, collaborator, automation, storage and marketing needs. The selection should be an operational decision, not a design decision: both Studio and a headless project have independent developer/design considerations.

Do not select Business Elite merely because Wix uses the word “API.” Wix Headless APIs exist across a range of headless architectures, and KLUB’s initial business scale does not require 10 million CMS items or the most advanced data resources. Upgrade after a measured need emerges.

### 7.3 Paid plan decisions to verify in account

| Item to verify | Why |
|---|---|
| Online payment provider availability for Cyprus | Payment options are country/entity dependent. |
| Currency and tax configuration | Prices are in EUR and must align with business setup. |
| Bookings service and pricing-plan availability | Verify classes, appointments and plan sales function as intended. |
| Collaborator permissions | Operations, marketing, developer and owner should not share an owner login. |
| Custom domain / domain transfer | Set up only after launch domain strategy is agreed. |
| Marketing/email/SMS quota | Avoid a campaign blocking surprise. |
| Media storage and video strategy | Prevent large hero media from harming performance or exceeding plan storage. |

---

## 8. Programmatic Wix: Velo, SDK, REST APIs, CLI and Webhooks

### 8.1 Overview

Wix provides multiple technical surfaces. Use the most constrained/managed one that satisfies the requirement. Native Studio components are lowest complexity; Velo is appropriate for behavior inside Wix sites; the JavaScript SDK/REST APIs are appropriate for headless/custom frontends and external services; the Wix CLI supports new Wix apps and Wix-managed headless projects. [5] [8] [19]

| Surface | Best use | Where code lives | KLUB example |
|---|---|---|---|
| Studio no-code | Layout, forms, CMS connections, simple animation | Wix Studio editor | Class grid and founder lead form. |
| Custom CSS in Studio | Brand fine-tuning | Studio CSS | Custom button/arch/typography treatment. |
| Velo | Custom UI logic and secure site backend methods | Wix website files | Conditional founding offer or custom filtered class list. |
| JavaScript SDK | Frontend/server calls to Wix business services | Headless Astro/other JS project | Query Bookings services and slots. |
| REST API | Server-to-server integrations | Secure server / automation | Sync confirmed booking metadata to another system. |
| Wix CLI | Headless app creation, link, development, preview/release | Local project / CI | Connect KLUB’s Astro project to Wix-managed Headless. |
| Webhooks/event handlers | React to platform events | Secure backend extension/service | Notify CRM when a booking is confirmed. |

### 8.2 Velo capabilities and when to use it

Velo development includes front-end code, backend code, JavaScript/SDK APIs, routers, npm packages, data access, business-solution integrations, security/performance guidance and automations. [5] Use it to create behavior that cannot be modeled with CMS datasets, native Bookings and Studio interactions.

Good KLUB Velo use cases include a personalized post-form response, a filtered “choose your level” exploration interaction, an authorized private integration endpoint, a controlled CMS data migration or an internal dashboard extension. Poor first-release uses include recreating the whole booking checkout, storing client health data in a general CMS collection, or building a custom timetable before configuring Bookings.

### 8.3 REST API and JavaScript SDK

The Wix REST API exposes HTTP access to Wix business solutions/site data. The JavaScript SDK supplies a client and modules for authenticated API calls. The API catalog includes Bookings resources for services, staff, resources, pricing, policies, time slots, bookings and external calendar synchronization. [8] [10]

**Security rule:** Never expose privileged API keys, OAuth secrets, payment credentials or write-capable admin tokens in browser source. Use Wix-managed authentication for the Astro integration or an appropriate secured backend. Store secrets in environment/secret management, not GitHub Pages code.

### 8.4 Wix CLI and existing Astro project linkage

Wix CLI is a command-line tool for Wix apps and Wix-managed headless projects. It uses Astro-based project structures for headless work, handles local development/preview/release, supports TypeScript and offers managed hosting characteristics including CDN, serverless operation, SSL and session middleware. [19]

Wix provides a special existing-Astro path:

```bash
# Preconditions: Astro 5, Astro config exists, project is not already Wix-linked.
npm create @wix/new@latest -- headless link
```

This provisions a Wix business and site, modifies the existing Astro project, installs dependencies and configures the integration. The Astro integration handles authentication and makes SDK use more direct. [1]

### 8.5 Bookings API workflow

A custom Booking frontend should follow Wix’s documented sequence: query service; retrieve any variants/add-ons; retrieve class-event or appointment slots; collect the service booking form; revalidate availability; create booking; create checkout; redirect to checkout; and respond to confirmation/decline/pending events. [20]

> **Do not skip slot revalidation.** A UI showing a slot as available is not a guarantee that it remains available when the client reaches payment. Wix’s documented flow revalidates before booking creation and its confirmation flow describes potential booking conflict handling. [20]

For the first KLUB release, prefer a secure **Wix-managed checkout redirect** rather than inventing a fully custom payment interface. Custom checkout can be implemented but must create/record orders and confirm booking status correctly. [11]

### 8.6 Illustrative SDK example

The following is a conceptual building block. Use the actual client and generated project setup from Wix documentation; do not paste credentials into the code.

```ts
// Illustrative only: created after the Wix-managed Astro integration is configured.
export async function listAvailableClassSlots(
  serviceId: string,
  fromLocalDate: string,
  toLocalDate: string,
) {
  const response = await wixClient.eventTimeSlots.listEventTimeSlots({
    serviceId,
    fromLocalDate,
    toLocalDate,
    timeZone: "Asia/Nicosia",
    openSpots: 1,
  });

  return response.timeSlots ?? [];
}
```

Wix’s Bookings quick start documents service discovery, availability lookup and a Wix checkout redirect approach using `@wix/sdk`, `@wix/bookings` and `@wix/redirects`; it cautions that the displayed dates are local to the business time zone. [21]

---

## 9. Headless Website Creation Methods

### 9.1 Wix-managed Headless with Astro — **recommended for KLUB**

Wix-managed Headless with Astro gives the highest preservation of KLUB’s existing design. Wix hosts/deploys the frontend and manages authentication, SEO support, extensions, analytics, secrets and the Wix CLI workflow for the Astro integration. Wix calls this its recommended development path for new headless projects. [2]

| Step | KLUB action | Exit criterion |
|---:|---|---|
| 1 | Create a `wix-headless-poc` branch. | Current build is green on branch. |
| 2 | Upgrade Astro 4 to supported Astro 5; regression test all routes/media. | `npm run build` passes. |
| 3 | Run the Wix existing-project link flow. | Wix business/site exists and local dev runs. |
| 4 | Configure Bookings services/policies/pricing plans in Wix dashboard. | Four services available in dashboard. |
| 5 | Implement a service/slot/checkout proof on `/book/`. | Test checkout redirect works. |
| 6 | Test customer journey and notifications. | Booking is confirmed in calendar and client receives confirmation. |
| 7 | Deploy preview, validate SEO and design. | Owner signs off. |
| 8 | Move custom domain after redirect/SEO plan. | Production site stable. |

### 9.2 Self-managed Headless

Self-managed Headless retains your current preferred host/framework. You are responsible for hosting, authentication/OAuth configuration, session handling, application configuration, redirects, error handling and secrets. Use it only if Wix-managed hosting is incompatible with a genuine requirement. [2]

An Astro site that remains self-hosted can still use the SDK/REST API. The extra engineering burden is not zero: the Bookings quick start calls for a headless project, OAuth app, hosted-pages domain, allowed redirect domain, API packages and session-token handling. [21]

### 9.3 Existing static site plus booking link

This is the least risky immediate transition. Keep the existing Astro site exactly as is. Create Wix Bookings services and link primary CTA buttons to the relevant Wix service/booking/checkout page. Do not embed a fragile iframe/third-party workaround without confirming its mobile behavior, checkout state and privacy impact. A separate branded booking subdomain can be considered after domain setup is confirmed in Wix.

### 9.4 Wix Studio native rebuild

Use the full Studio route when staff need drag-and-drop page control. Rebuild from an empty canvas and use the master KLUB source as the content/design blueprint. Build globally reusable header, footer, CTA, hero, ticker, card and lead form sections; migrate class content into CMS; then wire Bookings widgets/pages to operating services.

### 9.5 Site-creation method comparison

| Method | Visual editing after launch | Dev complexity | Migration effort | SEO risk | Fit for KLUB |
|---|---:|---:|---:|---:|---|
| Studio rebuild | High | Low–medium | Medium–high | Medium | Good when staff own website editing. |
| Hybrid links | Low | Low | Low | Low | Excellent interim approach. |
| Managed Astro headless | Low–medium | Medium | Low–medium | Low–medium | **Best code-preserving final route.** |
| Self-managed headless | Low | High | Low–medium | Medium | Only if host control is essential. |

---

## 10. Migration Process: Manual Studio Rebuild

### 10.1 Rebuild sequence

1. Create a new Studio project from Blank Canvas; do not alter the current public GitHub Pages site.
2. Set global brand tokens: linen background, white/sand surfaces, ink/umber text, hairline borders, DM Serif Display and DM Sans.
3. Recreate header, announcement bar, footer and floating contact behavior as global sections.
4. Build the homepage from larger editorial sections before minor embellishments.
5. Create a `Classes` CMS collection and import core records. Build dynamic list/item pages.
6. Build static informational pages from existing copy and SEO records.
7. Add Wix Bookings, create services, policies, schedule, pricing plans and booking forms.
8. Replace generic Book Now controls with service-aware booking links.
9. Add launch lead capture with consent and automation.
10. Test all breakpoints, booking paths, form data, SEO metadata and redirects before publication.

### 10.2 Studio-specific build principles

Use Studio containers, grids, stacks, global sections and responsive measurements. Do not use unstructured absolute positioning for major page layout. Give all media a purpose, file name and correct alt description. Design desktop first, then validate tablet/mobile; use mobile overrides for visual composition, but remember that content/hierarchy actions can affect all breakpoints. [4]

### 10.3 Design translation

| Existing visual principle | Studio translation |
|---|---|
| Warm linen full background | Site theme/background token `#F7F3EE`. |
| Elegant serif display text | DM Serif Display theme typography. |
| Sans body/labels | DM Sans theme typography. |
| Arch image frames | Studio image shape/mask or deliberately styled container; test mobile crops. |
| Marquee ticker | Native animation/strip where accessible; avoid essential information only in moving text. |
| Two-button hero | Responsive stack on mobile; primary action first. |
| Class cards | CMS-bound repeater with equal content height and visible CTA. |
| Soft white cards with fine border | Saved global class; not repeated local overrides. |
| Dark booking CTA | One accessible, reusable primary-button component. |

---

## 11. Restrictions, Risks, and Anti-Patterns

### 11.1 Platform restrictions

| Restriction or caveat | Effect on KLUB | Mitigation |
|---|---|---|
| External Astro code is not imported as editable Studio pages | Cannot “upload the site into Wix Editor.” | Choose headless to retain code or rebuild Studio manually. |
| Existing-Astro Wix linking requires Astro 5 | Current Astro 4 site needs migration work. | Use a proof branch and regression suite. [1] |
| Website waitlist sign-up is not supported in normal desktop widgets | Do not promise desktop waitlist CTA. | Mobile-app waitlist, interest form, or manual queue. [14] |
| Booking/payment requires paid site capability | Free setup cannot be commercial launch. | Choose suitable plan after account-level validation. [9] |
| CMS item/data limits exist | Not a current scale issue but relevant to future apps/data. | Use Bookings app collections and external DB if scale needs exceed limits. [16] |
| CMS writes are eventually consistent | Read-after-write can be stale. | Design retries/refresh states rather than assume immediate update. [22] |
| Native Studio site cannot be converted from existing Wix Editor by a magic upgrade | Rebuild still required if visual-editor route chosen. | Start with Studio before full page build. [23] |
| Country-specific payment/billing availability | Cyprus operations may differ from generic docs. | Verify inside Wix checkout before a commercial promise. |

### 11.2 High-risk anti-patterns

**Do not duplicate Bookings data in a manually maintained timetable CMS table.** Display service marketing content from CMS; let Bookings set availability. **Do not build a custom checkout first.** Start with Wix-managed checkout. **Do not use a single owner login.** Assign scoped collaborator roles. **Do not store sensitive health data in generic public-read collections.** **Do not make a visual rebuild without redirect/metadata inventory.** **Do not add app-market tools without a responsible owner, data review and removal plan.**

### 11.3 Data and performance constraints

Wix’s Data API documents 500 KB/512 KB item payload limits, request quotas, plan-dependent timeouts, query/index considerations and eventual-consistency behavior. Use filtered, limited/paginated queries and return only needed fields. [16] [17] [22]

For KLUB, minimize hero video impact, lazy-load below-fold media, avoid simultaneous large videos, use correctly sized images and do not fetch full CMS collections on initial load. This matters more for perceived quality than advanced database capacity.

---

## 12. SEO, Accessibility, and Marketing Migration

### 12.1 SEO retention rules

Preserve per-page title, meta description, canonical URL, Open Graph image, heading hierarchy, existing indexability and page intent. Maintain existing paths where possible; use 301 redirects from every retired public route to its exact successor. Do not redirect every old page to the home page.

KLUB’s existing SEO structure should be copied from the repository’s site/page data into either Wix SEO settings (Studio) or Astro metadata (headless). Use Wix dynamic-page SEO settings for the dynamic `Classes` collection; Wix describes dynamic slugs and per-item SEO configuration in its CMS documentation. [15]

### 12.2 Accessibility rules

Use meaningful link text, a single logical H1 per page, heading progression, non-empty image alt text where images communicate content, visible focus styles, sufficient color contrast, keyboard-operable menus/forms, captions/transcripts for informational video, and error messages that state how to correct form fields. Do not rely on movement, hover or color alone for essential booking information.

### 12.3 Founding-member capture

The founding-member form should collect only what is needed, state the marketing purpose in plain language, use a non-prechecked consent box, make unsubscribe possible, and route submissions to a defined contacts/marketing process. Treat email marketing consent distinctly from operational booking communication.

---

## 13. Implementation Templates and Examples

The package includes **30 reusable implementation templates** in `Wix_KLUB_Implementation_Templates.md`. They cover: a project brief; Studio tokens; page blueprint; responsive QA; asset manifest; CMS schemas; CSV imports; group/private Bookings services; policies; packages; memberships; booking test scripts; Astro readiness; Wix link command; headless service/availability/checkout examples; event contract; secure-secret rules; custom-flow gate; SEO record; redirects; content/legal review; performance criteria; roles; and go-live sign-off.

Use templates in this order:

| Stage | Templates |
|---|---|
| Brand and content foundation | 01–10 |
| Booking operations | 11–16 |
| Headless or custom code | 17–24 |
| Launch/SEO/governance | 25–30 |

---

## 14. Troubleshooting Guide

| Symptom | Likely cause | Diagnostic action | Resolution |
|---|---|---|---|
| “Can I upload the GitHub repo to Wix?” | Confusion between Wix visual sites and headless projects | Decide whether editable canvas or retained code is required | Rebuild in Studio or link the Astro project as headless. |
| Existing Astro link fails | Astro version below required level / project already linked | Check `package.json`, `astro.config.mjs`, `wix.config.json` | Upgrade in a branch; follow Wix’s current prerequisites. |
| A class looks full incorrectly | Separate schedule data or stale UI | Check Bookings calendar and service availability | Use Bookings as operational truth; refresh/revalidate availability. |
| A class overbooks | Custom flow skipped revalidation or configuration error | Run two-user simultaneous booking test | Revalidate before booking and inspect capacity/policy/resource configuration. |
| Waitlist CTA fails on desktop | Wix product constraint | Test desktop vs mobile app | Change UI expectation; use mobile app/manual alternative. |
| CMS dynamic page missing data | Dataset permission/filter/slug issue | Inspect record publish flag, dataset filters, field binding | Correct permission, live data, slug or required field. |
| Page is slow | Heavy media or unbounded data load | Test network waterfall/size and CMS query behavior | Compress/resize, lazy load, filter and paginate. |
| Bookings works but payment fails | Plan/payment-provider configuration | Check dashboard payment onboarding and provider availability | Complete provider setup and run test payment before launch. |
| Mobile design breaks after desktop edit | Cross-breakpoint structural/data action | Review Studio breakpoint indicators/layers | Restore layout, then use design/layout overrides appropriately. |
| Booking confirmation does not arrive | Notification setting/contact details/automation state | Test a fresh contact with inbox and phone | Configure/enable notifications; confirm messages and consent flow. |

---

## 15. Final Recommended Architecture

```text
Option A — Recommended final state

Visitor
  → KLUB Astro frontend (current design preserved)
  → Wix-managed Headless hosting / Astro integration
  → Wix Bookings (services, schedules, capacity, policies, forms)
  → Wix eCommerce Checkout / payment provider
  → Wix Contacts, Members, Bookings Calendar, notifications

Editorial content
  → Astro code initially
  → Optional Wix CMS for selected editable content

Option B — Immediate interim state

Visitor
  → Existing GitHub Pages / static-hosted KLUB Astro site
  → Wix booking service/page links for booking/payment
  → Wix Bookings / checkout / operations dashboard
```

**Choose Option A** if retaining KLUB’s current high-quality design is important and a developer can manage Astro updates. **Choose a Studio rebuild** if staff require visual self-service page design editing. **Use Option B** as an immediate low-risk operational bridge.

---

## 16. References

[1]: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project "Connect an Existing Astro Project — Wix Developers"
[2]: https://dev.wix.com/docs/go-headless/get-started/choose-your-development-path "Headless Development Paths — Wix Developers"
[3]: https://support.wix.com/en/article/wix-studio-about-the-studio-editor "Wix Studio: About the Studio Editor"
[4]: https://support.wix.com/en/article/studio-editor-designing-across-breakpoints "Studio Editor: Designing Across Breakpoints"
[5]: https://dev.wix.com/docs/develop-websites "Extend Websites with Velo — Wix Developers"
[6]: https://support.wix.com/en/article/studio-editor-building-a-site-with-a-template "Studio Editor: Building a Site with a Template"
[7]: https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/about-git-integration-wix-cli-for-sites "About Git Integration & Wix CLI for Sites"
[8]: https://dev.wix.com/docs/api-reference "Wix Unified API Reference"
[9]: https://support.wix.com/en/article/wix-bookings-about-wix-bookings "Wix Bookings: About Wix Bookings"
[10]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/introduction "About Wix Bookings — Wix Developers"
[11]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/architecture "Wix Bookings Architecture and Data Flow"
[12]: https://support.wix.com/en/article/wix-bookings-setting-up-your-booking-policies "Wix Bookings: Setting Up Your Booking Policies"
[13]: https://support.wix.com/en/article/wix-bookings-about-memberships-and-packages "Wix Bookings: About Memberships and Packages"
[14]: https://support.wix.com/en/article/wix-bookings-adding-and-setting-up-waitlists "Wix Bookings: Adding and Managing Waitlists for Classes"
[15]: https://support.wix.com/en/article/cms-content-management-system-an-overview "CMS (Content Management System): An Overview"
[16]: https://support.wix.com/en/article/cms-understanding-collection-storage-limits-and-quotas "CMS: Collection Storage Limits and Quotas"
[17]: https://dev.wix.com/docs/develop-websites/articles/best-practices/best-practices-for-improving-performance-in-wix-sites-with-data "Performance Best Practices for Wix Sites with Data"
[18]: https://support.wix.com/en/article/choosing-a-premium-plan "Choosing a Premium Plan"
[19]: https://dev.wix.com/docs/wix-cli/guides/about-the-wix-cli "About the Wix CLI"
[20]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/flow-single-service-booking "Single-Service Booking Flow"
[21]: https://dev.wix.com/docs/go-headless/self-managed-headless/tutorials/java-script-sdk-tutorials/bookings-quick-start "Bookings Quick Start"
[22]: https://dev.wix.com/docs/velo/apis/wix-data-v2/introduction "About the Wix Data API"
[23]: https://support.wix.com/en/article/wix-studio-switching-to-wix-studio "Switching to the Wix Studio Platform"
