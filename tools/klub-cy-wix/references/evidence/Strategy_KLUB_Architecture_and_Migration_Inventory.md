# KLUB Architecture and Wix Migration Inventory

## Executive Findings

The repository contains **179 migration-relevant source files**, **14 Astro route files**, **10 Astro components**, **5 JSON content models**, and **87 public assets**. The source builds as a static Astro site and uses Decap CMS/Netlify-oriented content and form patterns that require explicit Wix equivalents.

## Route Inventory

| Route | Source | Dynamic source |
|---|---|---|
| `/404.html` | `src/pages/404.astro` | No |
| `/about/` | `src/pages/about.astro` | No |
| `/book/` | `src/pages/book.astro` | No |
| `/classes/[slug]/` | `src/pages/classes/[slug].astro` | Yes |
| `/classes/` | `src/pages/classes/index.astro` | No |
| `/contact/` | `src/pages/contact.astro` | No |
| `/faq/` | `src/pages/faq.astro` | No |
| `/founding-member/` | `src/pages/founding-member.astro` | No |
| `/` | `src/pages/index.astro` | No |
| `/instructors/` | `src/pages/instructors.astro` | No |
| `/location/` | `src/pages/location.astro` | No |
| `/policies/` | `src/pages/policies.astro` | No |
| `/pricing/` | `src/pages/pricing.astro` | No |
| `/timetable/` | `src/pages/timetable.astro` | No |

## Content Models

| File | Top-level keys | Field nodes | Bytes |
|---|---|---:|---:|
| `src/content/classes.json` | `classes` | 98 | 6528 |
| `src/content/faq.json` | `seo`, `hero`, `still`, `sections` | 143 | 9861 |
| `src/content/home.json` | `seo`, `heroHeading`, `heroLede`, `heroSecondaryLabel`, `heroImage`, `heroAlt`, `about`, `classesHead`, `intro`, `experience`, `community`, `location`, `closing` | 65 | 3116 |
| `src/content/pricing.json` | `seo`, `hero`, `tables`, `termsText`, `faqs` | 110 | 4136 |
| `src/content/studio.json` | `email`, `whatsappNumber`, `phoneDisplay`, `bookingUrl`, `bsportCompanyId`, `bsportWidgetId`, `ctaLabel`, `ctaCompact`, `ga4Id`, `clarityId`, `streetAddress`, `addressLocality`, `addressNote`, `instagram`, `instagramHandle`, `facebook`, `tiktok`, `tiktokHandle`, `openingLabel`, `openingHours`, `foundingForm`, `banner` | 33 | 1215 |

## Assets

| Extension | Count |
|---|---:|
| `.jpg` | 39 |
| `.webp` | 33 |
| `.woff2` | 5 |
| `.mp4` | 4 |
| `.txt` | 2 |
| `.html` | 1 |
| `.js` | 1 |
| `.svg` | 1 |
| `.yml` | 1 |

## Integrations Detected

| Integration or concern | Files containing evidence |
|---|---:|
| whatsapp | 27 |
| instagram | 23 |
| netlify | 22 |
| playwright | 22 |
| wix | 21 |
| clarity | 9 |
| decap | 9 |
| schema.org | 5 |
| axe-core | 4 |
| google analytics | 4 |

## Migration-Critical Observations

The current content source of truth is a set of JSON files edited through Decap CMS. A Wix migration should map stable reusable entities to Wix CMS collections, while one-off page copy can remain page content unless editorial requirements justify a collection.

Netlify form attributes and post-submit scripts are platform-specific. Replace them with Wix Forms or custom Wix form handling, then reproduce spam protection, consent language, success states, notifications, CRM/contact creation, and analytics events.

The site exposes structured data, canonical and sitemap behavior, CTA instrumentation, responsive breakpoints, accessibility checks, and internal-link/orphan checks. Preserve these as migration acceptance criteria rather than treating visual similarity alone as success.

The dynamic class route currently expands four class records. Preserve the slug contract and page URLs, either through Wix CMS dynamic pages or explicit routes, and create redirects only if the final Wix URL model cannot match.

## Validation Baseline

The freshly pinned Astro production build completed successfully. The focused local Playwright acceptance suite completed with **193 passing tests and 5 skipped tests**. The full one-shot workflow must run the complete cross-browser suite again before any cutover.

## Machine-Readable Companion

See `klub-architecture-inventory.json` for field-level content schemas, asset hashes and dimensions, external URLs, detected integrations, imports, forms, schema types, and test declarations.
