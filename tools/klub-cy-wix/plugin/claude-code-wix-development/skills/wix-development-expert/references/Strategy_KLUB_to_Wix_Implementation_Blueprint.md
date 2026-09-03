# KLUB to Wix Implementation Blueprint

**Author:** Manus AI  
**Source:** [`ma4kos/KLUB`](https://github.com/ma4kos/KLUB)  
**Recommended target:** Wix-managed Headless with Astro, Wix CMS, Wix Media Manager, Wix Forms/CRM, and an explicit booking-system decision

## 1. Recommendation

Use a **Wix-managed Headless Astro project** as the primary migration target. This option preserves KLUB’s validated Astro frontend, custom visual identity, component structure, animations, structured-data behavior, and regression tests while moving the project into Wix’s managed development and hosting environment and replacing local/Decap-backed data with Wix CMS and selected Wix business solutions.[1] [2]

A native Wix Studio rebuild remains viable if non-developer drag-and-drop editing is more important than code-level fidelity. It should be treated as an alternative implementation, not as the default, because it introduces substantially more manual reconstruction and makes direct reuse of KLUB’s Astro components, CSS behavior, and 862-test validation baseline less straightforward.

> Preserve KLUB as a code-first site and replace its backend/editorial dependencies incrementally. Do not rewrite the visual frontend before the Wix project, content schema, and business-solution decisions are stable.

## 2. Validated Source Baseline

The acquired default branch builds successfully as a static Astro site. It contains 14 Astro route source files that generate 17 production pages, including four class-detail pages. The repository includes 10 shared Astro components, five JSON content models, 87 public assets, Netlify/Decap-oriented forms and content editing, analytics hooks, structured data, sitemap/canonical behavior, accessibility tests, responsive breakpoint tests, internal-link tests, and CTA instrumentation.

After installing the required Playwright browsers and system dependencies, the complete test run produced **862 passing tests and 45 skipped tests**. This baseline becomes the migration acceptance contract. The migration is not complete merely because the Wix project builds.

## 3. Target Architecture

| Layer | KLUB source | Wix target |
|---|---|---|
| Frontend runtime | Astro 5 static site | Wix-managed Headless Astro project scaffolded with Wix CLI |
| Hosting and release | Netlify-oriented static deployment | Wix-managed Headless build, preview, release, CDN, and managed hosting |
| Editorial content | `src/content/*.json` through Decap CMS | Wix CMS collections and single-record settings entities |
| Media | `public/images`, videos, local fonts | Wix Media Manager plus retained build-time/static assets where appropriate |
| Classes | `classes.json` and `src/pages/classes/[slug].astro` | `Classes` CMS collection plus `/classes/{slug}/` route binding |
| FAQ | Nested `faq.json` sections and items | `FaqSections` and `FaqItems` collections, or one structured FAQ collection if editorial simplicity is preferred |
| Pricing | Nested pricing tables and rows | `PricingGroups` and `PricingItems` collections; retain one-off legal/intro copy as page or settings content |
| Global studio data | `studio.json` | Single `SiteSettings` record plus secrets/environment configuration for analytics IDs where required |
| Forms | Netlify form attributes and custom success scripts | Wix Forms and CRM, or a custom form handler using Wix APIs when field/control parity demands it |
| Booking | `bookingUrl`, `bsportCompanyId`, `bsportWidgetId`, `BsportWidget.astro` | Decision gate: retain Bsport embed/link or migrate to Wix Bookings |
| SEO | `Base.astro`, page JSON SEO fields, schema blocks, Astro sitemap | Wix-managed Headless SEO integration plus explicit page metadata and JSON-LD verification |
| Analytics | Optional GA4/Clarity IDs and custom CTA/scroll/section events | Consent-gated GA4/Clarity or Wix analytics strategy with the existing event dictionary preserved |
| Tests | Playwright, axe-core, route/assets/SEO/content/CMS tests | Repoint environment-sensitive tests to Wix preview; retain repository-level data tests and visual/browser parity tests |

Wix-managed Headless provides the strongest reuse path for an Astro application and is the architecture used by Wix’s current Headless templates and migration tooling.[1] [2]

## 4. Route and URL Contract

Preserve all existing public paths unless Wix imposes an unavoidable constraint. The target route contract is:

| Source route | Target | Migration rule |
|---|---|---|
| `/` | Home route | Preserve exactly |
| `/about/` | Static Astro route | Preserve exactly |
| `/book/` | Booking route | Preserve; update behavior after booking decision |
| `/classes/` | Class index route | Preserve and bind to `Classes` collection |
| `/classes/foundations-reformer/` | Dynamic class detail | Preserve slug |
| `/classes/signature-reformer/` | Dynamic class detail | Preserve slug |
| `/classes/mat-pilates/` | Dynamic class detail | Preserve slug |
| `/classes/private-sessions/` | Dynamic class detail | Preserve slug |
| `/contact/` | Contact route | Preserve; replace form backend |
| `/faq/` | FAQ route | Preserve; bind to FAQ collections |
| `/founding-member/` | Lead-capture route | Preserve; replace form backend |
| `/instructors/` | Static or CMS-backed route | Preserve |
| `/location/` | Location route | Preserve |
| `/policies/` | Policy route | Preserve |
| `/pricing/` | Pricing route | Preserve; bind to pricing collections |
| `/timetable/` | Timetable route | Preserve; update after booking decision |
| `/404.html` | Error page | Recreate Wix-compatible not-found behavior and test it |

Use redirects only when a path cannot be retained. Generate the redirect map from source and target route manifests, review it before publishing, and verify every redirect with its final status and destination. Wix now exposes URL and SEO capabilities through its current API surface, but exact methods and request schemas must be retrieved at implementation time.[3]

## 5. Wix CMS Design

### 5.1 `Classes` Collection

The four source records use the field contract below. Preserve the source slug as the immutable migration identity.

| Wix field | Type | KLUB source | Rule |
|---|---|---|---|
| `sourceId` | Text, unique | `classes[{n}].slug` | Use `klub:class:<slug>` for idempotent upsert |
| `slug` | Text, unique | `slug` | Preserve URL-safe value |
| `name` | Text | `name` | Required |
| `shortDescription` | Text/Rich text | `short` | Preserve inline emphasis semantics |
| `intro` | Rich text | `intro` | Sanitize and preserve intended formatting |
| `level` | Text/enum | `level` | Values currently include beginner, all-level, and advanced language |
| `duration` | Text/number | `duration` | Normalize only if booking integration requires minutes |
| `capacity` | Text/number | `capacity` | Preserve source semantics |
| `priceDisplay` | Text | `price` | Do not parse into currency until business rules are confirmed |
| `image` | Media | `image` | Map through media crosswalk |
| `imageAlt` | Text | `imageAlt` | Required accessibility field |
| `goodFor` | Rich text/list | `goodFor` | Preserve source list/order |
| `whatToExpect` | Rich text/list | `expect` | Preserve source list/order |
| `seoTitle` | Text | `seoTitle` | Route metadata |
| `seoDescription` | Text | `seoDescription` | Route metadata |
| `sortOrder` | Number | source array index | Preserve class-index order |
| `sourceHash` | Text | normalized record hash | Detect changed records on resume |

### 5.2 FAQ Collections

The source contains six FAQ sections with 38 items in total. Prefer two related collections:

| Collection | Fields | Purpose |
|---|---|---|
| `FaqSections` | `sourceId`, `title`, `sortOrder`, `sourceHash` | Stable group ordering |
| `FaqItems` | `sourceId`, `sectionRef`, `question`, `answer`, `sortOrder`, `sourceHash` | Editable questions and answers with section relation |

Preserve the page-level `seo`, `hero`, and closing/“still need help” content in a single `FaqPageSettings` record or in the broader `PageSettings` model. Generate FAQPage JSON-LD from the same records rendered to visitors so structured data cannot drift from visible content.

### 5.3 Pricing Collections

The source has four pricing groups—Getting Started, Monthly, Flexi Packs, and Private 1-to-1—with nested rows using `name`, `price`, `per`, and optional `note`.

| Collection | Fields | Purpose |
|---|---|---|
| `PricingGroups` | `sourceId`, `title`, `blurb`, `columnLabels`, `sortOrder`, `sourceHash` | Pricing-section structure |
| `PricingItems` | `sourceId`, `groupRef`, `name`, `priceDisplay`, `billingUnit`, `note`, `sortOrder`, `sourceHash` | Individual visible offers |

Do not infer currency, taxes, plan entitlements, recurring billing, or Wix Pricing Plans behavior from display strings. If the user later wants transactional plans, create a separate approved mapping from visible pricing to Wix Pricing Plans or Bookings pricing after business rules are confirmed.

### 5.4 `SiteSettings` Single Record

Map `studio.json` to one settings record while keeping secrets and environment-specific identifiers out of public content where appropriate.

| Group | Source fields |
|---|---|
| Contact | `email`, `whatsappNumber`, `phoneDisplay` |
| Booking | `bookingUrl`, `bsportCompanyId`, `bsportWidgetId`, `ctaLabel`, `ctaCompact` |
| Analytics | `ga4Id`, `clarityId` |
| Location | `streetAddress`, `addressLocality`, `addressNote`, `openingLabel`, `openingHours` |
| Social | `instagram`, `instagramHandle`, `facebook`, `tiktok`, `tiktokHandle` |
| Founding member form | `foundingForm.interestOptions`, `foundingForm.submitLabel` |
| Announcement | `banner.enabled`, `banner.text`, `banner.linkText`, `banner.linkUrl` |

Opening hours are deliberately absent until confirmed. Preserve this rule. Do not publish guessed hours into the visible site or LocalBusiness/ExerciseGym structured data.

### 5.5 Home and One-Off Content

`home.json` includes page SEO, hero, about, class-section heading, introduction, experience, community, location, and closing content. Use either a single `HomePageSettings` record or retain the content in typed repository configuration. Choose CMS only if non-developers need to edit these sections after migration.

## 6. Media Migration

The source inventory includes 39 JPG files, 33 WebP files, four MP4 files, five WOFF2 font files, and supporting SVG/text/admin assets. Build a media manifest with source path, hash, dimensions, MIME type, alt text, usage routes, and Wix media ID/URL.

Upload media before CMS records. Deduplicate by hash and stable source identity. Verify read-back metadata and rendered crops. Do not upload Decap CMS administration assets unless the new Wix project still needs them; they are implementation dependencies of the old editorial system, not brand content.

Font handling requires a specific choice. If the managed Headless build may legally and technically bundle the existing font files, preserve the current `@fontsource`/local strategy. If fonts move to Wix Media Manager or another CDN, re-run typography and layout regression tests because metrics and loading behavior can change.

## 7. Forms, CRM, Consent, and Notifications

KLUB has a contact form and a founding-member form. Replace Netlify-specific attributes and success handling with Wix-compatible flows.

| Source behavior | Required Wix behavior |
|---|---|
| Required field validation | Preserve client and server validation |
| Netlify honeypot | Replace with Wix spam/bot protection and server-side validation |
| Founding-member interest options | Preserve current controlled list from `studio.json` |
| Consent/privacy note | Preserve visible language and link to `/policies/` |
| Success state | Preserve accessible `role="status"` behavior and focus/announcement path |
| Lead storage | Create or update a CRM contact with source identity and consent context |
| Notification | Configure owner notification/automation only after recipient and content approval |
| Analytics | Preserve `data-cta` or equivalent stable event IDs |
| Failure handling | Display recoverable error; do not lose user-entered values |

Retrieve the exact current Wix Forms and CRM method schemas before implementing custom API handling. Prefer native Wix Forms where it satisfies field, success-state, consent, CRM, and notification requirements. Use a custom Headless form handler only when native behavior cannot preserve the contract.[3]

## 8. Booking Decision Gate

The source deliberately supports an external booking URL and Bsport widget identifiers. Do not silently migrate or replace this system.

| Option | Select when | Implementation |
|---|---|---|
| **Retain Bsport** | Existing operational data, staff workflows, payments, and customer history remain in Bsport | Preserve `bookingUrl`; embed only if Bsport permits and the experience meets security, consent, mobile, and accessibility requirements |
| **Migrate to Wix Bookings** | The business explicitly chooses Wix as the booking system | Model services, staff, schedules, locations, availability, pricing/payment rules, notifications, cancellation policies, and customer data through a separate approved data migration |
| **Transitional link** | Booking-system migration will occur later | Keep Wix site CTAs linked to the current production booking URL and treat Bookings as a future phase |

The default safe state is the transitional link. It preserves business continuity and keeps the website migration independent from a booking-data migration.

## 9. Frontend Conversion

Create a real Wix-managed Headless project through the current Wix CLI. Then port KLUB in controlled layers:

1. Preserve the existing global CSS tokens, typography, breakpoints, and component boundaries.
2. Recreate the shared Base layout, header, mobile menu, footer, announcement banner, chat/contact action, and SEO shell.
3. Replace local JSON imports with Wix CMS data adapters that return the same presentation view models.
4. Keep pages rendering against fixtures until each CMS adapter passes schema and visual tests.
5. Replace Netlify form handlers.
6. Implement the selected booking mode.
7. Preserve consent-gated analytics, CTA IDs, scroll-depth events, and section-view events.
8. Run source and Wix previews at identical breakpoints and execute the gap loop.

The official Wix Headless replatform skill requires browser-backed evidence, a frozen extraction manifest, a real Wix CLI scaffold, source asset/font/interaction preservation, and post-build visual review rather than build-only completion.[2]

## 10. Visual, Accessibility, SEO, and Functional Acceptance

### Visual Acceptance

Compare the source and Wix preview at 320, 360, 375, 390, 412, 768, 1024, 1099, 1100, 1101, 1280, 1440, and 1920 pixels where the current breakpoint tests establish expectations. Require correct first-viewport hierarchy, typography, navigation transitions, class cards, image crops, video masks/controls, hover/focus states, announcement behavior, and mobile sticky booking action.

### Accessibility Acceptance

Retain the existing axe-core checks for WCAG A/AA issues on the home, pricing, and classes pages at desktop and phone widths. Preserve keyboard operation of the mobile menu, Escape behavior where applicable, visible focus, pause controls for motion/marquee content, alt text, landmarks, status announcements, and semantic structured content.

### SEO Acceptance

Validate titles, descriptions, canonical URLs, Open Graph data, sitemap, robots, internal links, orphan-page rules, and structured data. The source currently emits ExerciseGym/PostalAddress/OpeningHoursSpecification, OfferCatalog/Offer, Service, FAQPage/Question/Answer, Course, and Organization schema types. Preserve only schema that remains factually supported after the business-system decision.

### Functional Acceptance

Require every public route and asset to resolve, every internal link to work, every CTA to retain a unique event identity, forms to create the intended Wix/CRM state, booking CTAs to reach the approved system, and CMS content to match the approved source hash and count.

## 11. Controlled Execution Sequence

| Stage | Read/write mode | Durable output |
|---|---|---|
| Source acquisition and validation | Read only | Source archive, build/test evidence |
| Wix destination resolution | Read only until approved | Pinned account/site/project record |
| Inventory and mapping | Read only | Approved route/content/media/business mapping |
| Wix project scaffold | Write after approval | One Wix-managed Headless project with identity |
| Business-solution installation and CMS setup | Write after approval | Verified apps, collections, permissions |
| Media import | Idempotent write | Media crosswalk and read-back verification |
| CMS data import | Idempotent write | Record crosswalks, counts, hashes, errors |
| Frontend implementation | Repository write | Wix adapters and preserved presentation components |
| Preview and gap loop | Read/test and bounded code writes | Screenshot review and resolved discrepancy log |
| Release | Sensitive write after final approval | Release receipt and target URL |
| DNS cutover | Sensitive external change | Domain verification and rollback record |
| Finalization | Read/reconcile | Aggregate completion report |

## 12. Current Execution Boundary

The source analysis, build, tests, mappings, CMS design, route plan, media manifest design, form/booking decision model, and implementation sequence can be prepared without Wix write access. A concrete Wix project scaffold, app installation, CMS provisioning, media upload, data import, preview deployment, and release require an authenticated Wix account and a selected destination site/project.

No Wix writes or site creation should occur until the user approves the destination and the execution plan. The Wix MCP distinguishes account-level site management from site-scoped API operations; implementation must use the correct scope and site context.[3]

## 13. Rollback and Completion

Keep the existing Astro deployment and source repository unchanged until Wix preview approval and post-cutover validation. The primary release rollback is DNS reversion to the existing deployment. Data/setup rollback uses the persisted crosswalks and operation log, with deletion or restoration only where the corresponding Wix operation is safe and approved.

Declare completion only when the Wix project reuses one pinned destination, imported entities reconcile to source counts or explicit exclusions, all critical/high visual and functional gaps are resolved, route/SEO/accessibility/business tests pass, release evidence exists, and the final report records any accepted lower-severity gaps.

## References

[1]: https://dev.wix.com/docs/go-headless/wix-managed-headless/about-wix-managed-headless.md "About Wix-Managed Headless"
[2]: https://github.com/wix/skills/blob/main/wix-headless-replatform/SKILL.md "Wix Headless replatform skill"
[3]: https://dev.wix.com/docs/sdk/articles/use-the-wix-mcp/about-the-wix-mcp.md "About the Wix MCP"
[4]: https://github.com/ma4kos/KLUB "KLUB source repository"
