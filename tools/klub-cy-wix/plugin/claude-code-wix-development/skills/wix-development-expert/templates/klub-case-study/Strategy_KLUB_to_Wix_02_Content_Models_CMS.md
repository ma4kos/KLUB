# KLUB-to-Wix Content Models and CMS Strategy

## 1. Governing Decision

Use **Wix CMS as the canonical editorial content layer** for KLUB’s existing pages. Treat Wix Bookings as an optional operational system for schedules, service availability, capacity, staff assignment, and transactions only if KLUB chooses to replace or supplement its current Bsport booking path.

This dual-representation rule removes a false either/or choice. A class page contains editorial material—name, slug, level, descriptive copy, image, alt text, SEO title, SEO description, expectations, and suitability—that belongs in CMS. A bookable service contains operational fields—schedule, staff, capacity, location, price options, cancellation rules, and booking status—that may belong in Wix Bookings. If both exist, link them using stable IDs; do not collapse one model into the other.

> The migration must not imply that adopting Wix CMS requires adopting Wix Bookings, or that adopting Wix Bookings eliminates the CMS record used to render the class page.

## 2. Verified KLUB Source Models

The repository inventory identifies four structured JSON inputs under `src/content/` and two supporting TypeScript modules under `src/data/`. These are the source-of-truth files for the read-only transformation proof.

| Source | Verified structure | Target |
|---|---|---|
| `src/content/classes.json` | Four class records with slug, name, level, duration, capacity, price, short copy, SEO, intro, expectations, suitability, image, and alt text | `Classes` Wix CMS collection |
| `src/content/faq.json` | Six FAQ sections containing 38 FAQ items | `FaqSections` and `FaqItems` Wix CMS collections |
| `src/content/pricing.json` | Four pricing groups containing 12 pricing items | `PricingGroups` and `PricingItems` Wix CMS collections |
| `src/content/studio.json` | One studio/settings record | `SiteSettings` singleton-style CMS collection and selected Wix Business Info fields |
| `src/data/classes.ts` and `src/data/classDetails.ts` | Supporting typed class data and route/page composition | Migration evidence and frontend compatibility checks; do not import duplicate records |

The deterministic transformer under `examples/migration/src/build-klub-payloads.mjs` produces CMS-ready JSON payloads without contacting Wix. Its expected record counts are part of the validation contract.

## 3. CMS Collection Design

### 3.1 Classes

Use one `Classes` record per source class. Preserve the source `slug` as the durable import identity and dynamic-route key.

| Wix field | Type | Source | Rule |
|---|---|---|---|
| `sourceId` | Text, unique | Derived from repository and slug | Use `klub:class:<slug>` for idempotent upsert |
| `slug` | Text, unique | `slug` | Preserve exactly unless an approved redirect exists |
| `name` | Text | `name` | Required |
| `level` | Text or tag | `level` | Preserve source vocabulary first |
| `duration` | Text | `duration` | Preserve display value; add normalized minutes only if verified |
| `capacity` | Text | `capacity` | Preserve display value; add numeric capacity only if verified |
| `priceDisplay` | Text | `price` | Preserve as editorial display copy; do not use as transaction authority |
| `shortDescription` | Text | `short` | Required for cards and metadata fallback |
| `seoTitle` | Text | `seoTitle` | Preserve and validate length/rendering |
| `seoDescription` | Text | `seoDescription` | Preserve and validate rendering |
| `intro` | Rich text or structured JSON | `intro[]` | Preserve paragraph order |
| `expectItems` | Structured JSON or linked repeaters | `expect[]` | Preserve order |
| `goodForItems` | Structured JSON or linked repeaters | `goodFor[]` | Preserve order |
| `imageSourcePath` | Text | `image` | Retain source provenance |
| `imageWixUrl` | Image/media reference | Media upload crosswalk | Populate after media upload |
| `imageAlt` | Text | `imageAlt` | Required accessibility field |
| `bookingProvider` | Text | Migration decision | `bsport`, `wix-bookings`, or `none` |
| `bookingTargetId` | Text | Provider crosswalk | Optional; never invent |

Arrays may be stored as structured JSON for a fast Headless migration or normalized into child collections if nontechnical editing, localization, or analytics requires item-level records. Decide before creating the Wix schema and record the decision in the frozen build plan.

### 3.2 FAQ

Use `FaqSections` and `FaqItems` rather than one opaque document when editorial reordering and accessibility matter. Preserve section and item order explicitly.

| Collection | Key fields | Relation |
|---|---|---|
| `FaqSections` | `sourceId`, `slug`, `title`, `sortOrder` | Parent |
| `FaqItems` | `sourceId`, `sectionSourceId`, `question`, `answer`, `sortOrder` | Many items to one section |

The imported answer must remain semantically structured. The frontend should render each question as a real button controlling a region, maintain `aria-expanded`, support keyboard input, and preserve heading hierarchy.

### 3.3 Pricing

Use `PricingGroups` and `PricingItems` as the editorial representation of KLUB’s current pricing page. Do not claim that every display item maps directly or “perfectly” to Wix Pricing Plans. A Wix Pricing Plan is a purchasable entitlement with operational rules, while KLUB’s JSON may also contain explanatory or non-transactional display copy.

Only create a Wix Pricing Plan after mapping currency, billing cadence, tax handling, term, benefits, eligibility, cancellation/refund rules, and the services it grants. Link an editorial `PricingItems` record to a verified Wix Pricing Plan ID through a crosswalk. If Bsport remains the transaction authority, keep the CMS item and preserve the approved Bsport booking/purchase destination.

### 3.4 Site Settings

Use one `SiteSettings` CMS record for frontend-configurable KLUB content. Selected verified values can also populate Wix Business Info, but do not create competing authorities.

| Data category | Canonical authority |
|---|---|
| Frontend headings, captions, CTA copy, display labels | `SiteSettings` CMS record |
| Official address, phone, and business hours used by Wix business solutions | Wix Business Info after approval |
| Source provenance and migration version | Migration manifest/crosswalk |
| Secrets, provider tokens, analytics credentials | Secret store, never CMS |

## 4. Optional Wix Bookings Mapping

Wix Bookings is a separate workstream controlled by an explicit product decision. Before replacing Bsport, compare scheduling, waitlists, capacity, memberships, payments, cancellation rules, client accounts, staff workflows, historical data, reporting, embeds, notifications, and operational ownership.

If Wix Bookings is selected, create a one-to-one or approved many-to-one crosswalk:

```text
CMS Classes.sourceId
  ↔ Wix Bookings service ID
  ↔ optional provider legacy ID
```

The CMS class record remains the source for the existing KLUB page’s editorial and SEO fields. Wix Bookings becomes the authority for bookable availability and transactional state. The frontend can query both and compose them without duplicating operational data in CMS.

If Bsport remains, preserve `BsportWidget.astro` behavior or implement an approved equivalent, document consent/cookie implications, and test the booking journey end to end. Do not claim a completed Wix Bookings migration.

## 5. Media and Relation Sequence

Import dependencies in this order:

1. Freeze the source manifest, hashes, and route inventory.
2. Upload or map media and save `source path → Wix media URL/ID` crosswalk entries.
3. Create CMS collection schemas after approval.
4. Upsert `SiteSettings`, class, FAQ-section, FAQ-item, pricing-group, and pricing-item records using stable `sourceId` values.
5. Resolve parent/child relations and preserve source ordering.
6. If approved, create or map Bookings services, staff, and Pricing Plans in a separate operational phase.
7. Update CMS crosswalk fields only after operational entities are read back successfully.
8. Render the Headless pages and validate content, SEO, accessibility, links, images, and business flows.

Every write must support a dry-run count and produce a source-to-Wix crosswalk. A retry should upsert rather than duplicate. Do not store live secrets, access tokens, or payment configuration in the import payloads.

## 6. Approval and Validation Gates

| Gate | Required evidence |
|---|---|
| Schema approval | Field names, types, required flags, indexes, permissions, relation strategy |
| Payload approval | Deterministic counts: 4 classes, 6 FAQ sections, 38 FAQ items, 4 pricing groups, 12 pricing items, 1 settings record |
| Media approval | Asset crosswalk, deduplication decision, alt text, crop/focal-point review |
| Business-system decision | Bsport preserved, Wix Bookings adopted, or hybrid; no implied choice |
| Write approval | Pinned site/account, exact methods, scopes, impact, idempotency, rollback limitation |
| Read-back validation | Wix record IDs, counts, relation checks, rejected records, retry state |
| Rendered validation | Route, metadata, canonical, JSON-LD, keyboard, responsive, visual, and form/booking parity |

## 7. Unresolved Inputs

The migration still requires the destination Wix site/account, the identity with sufficient permissions, the final CMS field-type choices, the source of truth for schedules and bookings, the Bsport-versus-Wix-Bookings decision, payment/provider requirements, cancellation and waitlist behavior, analytics/consent requirements, and ownership of future editorial and operational updates.

These are approval inputs, not reasons to stop read-only discovery or payload generation. They do prevent live Wix schema creation, business-solution setup, data writes, and production cutover.

## References

[1]: https://github.com/ma4kos/KLUB "KLUB source repository"
[2]: https://dev.wix.com/docs/api-reference/business-solutions/cms/data-items "Wix CMS Data Items"
[3]: https://dev.wix.com/docs/api-reference/business-solutions/bookings "Wix Bookings API"
[4]: https://dev.wix.com/docs/api-reference/business-solutions/pricing-plans "Wix Pricing Plans API"
[5]: https://dev.wix.com/docs/api-reference/assets/media "Wix Media API"
