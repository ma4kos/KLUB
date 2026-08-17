# Wix KLUB Migration Approach

**Purpose:** Define the recommended practical route for moving the KLUB Pilates website into the Wix ecosystem while preserving its current quality, search visibility, and booking requirements.

## Decision Summary

**Recommended path: use Wix-managed Headless with Astro as the primary route, with a native Wix Bookings implementation.** The current project is already an Astro static site. Wix now documents an official path to link an existing Astro project to a Wix-managed headless project, where Wix provisions the business/site, hosts the frontend, handles authentication for the Astro integration, and makes Wix SDK methods available. The explicit prerequisite is Astro 5; KLUB currently uses Astro 4.16.18, so it needs a controlled upgrade before or during a proof of concept. [1]

This route is the closest answer to “get the existing site into Wix.” It **does not convert the site into an editable Wix Studio canvas**. It preserves KLUB’s HTML/CSS/Astro design and moves its operating layer—hosting, bookings, checkout, business dashboard, data and automations—into Wix.

> **Decision rule:** Choose headless when design fidelity and developer control matter more than drag-and-drop editing. Choose a Wix Studio rebuild only when a non-technical team must directly redesign pages in a visual editor.

| Route | Design fidelity | MYSIWYG editing | Speed to first working booking | Long-term engineering | Recommendation |
|---|---:|---:|---:|---:|---|
| **A. Wix-managed Headless + Astro + Wix Bookings** | Highest | Content/business only; frontend remains code | Medium | Medium | **Primary recommendation** |
| **B. Current Astro site + native Wix booking-page links** | Highest | None for the existing frontend | Fastest | Low | Best interim / fallback |
| **C. Full Wix Studio rebuild + Wix Bookings** | High but not pixel-identical | Full | Medium | Low after rebuild | Best if staff need visual design editing |
| **D. Self-managed headless + Wix APIs** | Highest | None for frontend | Medium | Highest | Use only if retaining non-Wix hosting is a hard requirement |

## Why Headless Is a Strong Fit for KLUB

The KLUB repository already has a classic content-focused Astro architecture: shared studio configuration in `src/site.ts`, class catalogue data in `src/data/classes.ts`, long-form class detail data, reusable components, static routes and self-hosted design assets. Wix’s Wix-managed headless path is explicitly designed for Astro and offers managed hosting, automatic authentication, built-in SEO support, analytics, secrets management and extensions. Existing Astro projects can be linked through the Wix CLI rather than rebuilt from a new scaffold. [1] [2]

The route keeps the current warm editorial layout, local font use, arch media treatments, subtle design details, semantic HTML and performance characteristics within the codebase. Wix handles the operational functionality that a Pilates studio needs: booking services, classes, private appointments, schedules, capacity, pricing plans, payments, booking forms, client records, notifications, and calendar workflows. [3] [4]

## Recommended Phased Implementation

### Phase A — Preserve and prepare the current production site

Keep `https://ma4kos.github.io/KLUB/` live until the Wix-connected replacement is tested. Create a stable production branch, keep all media originals outside the site build, and capture the current URL list, metadata, Open Graph images, sitemap and performance baseline. Do not change the current public URLs until redirect and SEO mapping is final.

The current source has these launch blockers that should remain configuration values, not hard-coded page copy: confirmed WhatsApp number, phone display, exact street address, final price list, final booking schedule, payment provider, legal policy language and go-live date.

### Phase B — Establish Wix operations without changing the frontend

Create a Wix site/business and add Wix Bookings. Configure four services: three **Class** services—Reformer Fundamentals, Reformer Flow and Reformer Power—and one **Appointment** service—Private Sessions. Classes are the intended Wix service type for recurring group sessions with defined capacity; private 1-to-1 sessions are best configured as appointments. [3] [4]

Attach an identical policy to group services: 50-minute duration, six-person capacity, a 12-hour cancellation window, booking start/close window, and appropriate no-show/cancellation fee policy. Wix Booking Policies support customer cancellation and rescheduling windows, card-on-file, fees and maximum group participants. [5]

Configure product offering first as draft/unpublished, then test with three staff-created test contacts: one group booking, a cancellation outside the window, a cancellation within the window, an intro package use, an appointment booking, and a fully booked class. Test the waitlist separately in Wix’s mobile app because Wix states that customer class waitlist sign-up is mobile-app-only, not available in standard website/desktop booking widgets. [6]

### Phase C — Run a Wix-managed Headless proof of concept

Create a branch called `wix-headless-poc`. Upgrade Astro from version 4 to a Wix-supported Astro 5 version and verify the current `npm run build` still succeeds. In the project root, link the existing Astro app according to Wix’s documented command:

```bash
npm create @wix/new@latest -- headless link
```

The command provisions a Wix business and site, configures the project and installs required dependencies. It is designed for existing Astro apps that have an Astro configuration file, are on Astro 5, and are not already linked via `wix.config.json`. [1]

Do not merge or replace the public site after linking. First deploy a preview and use Wix Bookings API/SDK access to prove one real pathway: query the Bookings service list, retrieve available slots, and send a customer to Wix checkout. Wix’s Booking SDK documentation describes this flow and indicates that the Astro integration handles OAuth/client setup automatically. [3] [7]

### Phase D — Add booking calls to the KLUB frontend

Begin with a robust minimal integration: keep the existing visual booking CTAs and route them to a Wix-managed booking/checkout flow. Do not build a fully custom payment form in the first release. Custom booking experiences require availability revalidation, booking form handling, booking creation, checkout/order creation and handling of confirmation states and double-book conflicts. [4] [8]

Once the initial booking flow works, progressively enhance the existing `/book/` page into a branded service picker and availability screen. The UI can call Wix services and availability APIs, then create a Wix redirect session for a secure Wix-managed checkout. The developer example supplies the SDK modules and redirection pattern. [7]

### Phase E — Launch and optimise

Set the production custom domain only after: all metadata is preserved; old routes return the correct content or 301 redirect; booking test payments pass; membership/package rules are checked; automated messages reach a real mobile/email inbox; and conversion events are recorded. Watch bookings and form fills for two weeks, then decide whether an expanded custom booking UI is worth the engineering complexity.

## Alternate: Full Wix Studio Rebuild

A Studio rebuild is the correct option if Izzy or staff need to rearrange page design without changing code. Build a **new** Studio site from the Blank Canvas rather than force KLUB into an unrelated template. Wix Studio supports responsive grids, stacking, breakpoint overrides, reusable design sections, CMS dynamic pages, animations and custom CSS; it is far better suited than the standard Wix Editor for recreating the existing site’s custom layout. [9] [10]

The rebuild is manual. It means uploading the assets, creating each page/section, reentering the SEO data, recreating navigation and buttons, and importing content into the CMS. The current Astro source will serve as the visual and copy specification, not a file that Wix transforms into editable Studio pages.

Use the current Astro site as a live visual reference. The native page architecture should be: static pages for Home, About, Pricing, Timetable, Instructor, FAQ, Location, Contact, Founding Member, Policies and Book; a `Classes` CMS collection; a dynamic classes list; and one dynamic class-details page. Wix CMS dynamic item pages can create unique item URLs from a shared layout without consuming an additional page for every item. [11]

## Alternate: Immediate Hybrid Booking Route

If bookings must go live before a headless proof of concept is ready, leave the Astro site on its current host and set up Wix Bookings as a separate Wix site. Replace every site booking CTA with the appropriate Wix booking-service or booking-page URL. This protects the current high-quality brand site, reduces migration risk, and lets the team learn the Wix operational workflow before committing to a platform move. Wix Bookings can be added without cost, but Wix requires a paid plan to accept bookings and online payments. [12]

Use a branded subdomain such as `book.klub-cy.com` only after confirming the Wix domain and certificate setup in the relevant Wix account. Avoid making the main homepage route between platforms until SEO mapping is complete.

## UX Rules for the KLUB Build

| Area | Implementation rule |
|---|---|
| Brand styling | Keep the linen/ink/umber palette and DM Serif Display + DM Sans type pairing. Use reusable global classes/tokens, not page-by-page styling. |
| Layout | For Studio, use containers/grids/stacks, not loose absolute-positioned elements. For Astro, retain the existing responsive CSS and use semantic sections. |
| Media | Use JPG/WebP source images and compressed MP4 or Wix-hosted video. Use meaningful alt text; preserve the source alt text where accurate. |
| Pages | Preserve current slugs where possible. Add redirects before retiring the existing static routes. |
| Booking | Always show cancellation window, class capacity, duration, access requirements and pricing before checkout. |
| Data | Put editorial class data in CMS only if Studio editing is required. Use Wix Bookings as the operational source of truth for time slots, bookings, pricing-plan entitlement and attendance. Do not create a duplicate schedule database. |
| Privacy | Collect health or pregnancy information only if clinically/business-required, keep it off public CMS collections, and validate legal/privacy terms before go-live. |

## First 10 Work Items

1. Confirm the final domain, exact address, contact number, final schedule and final price/plan values.
2. Create the Wix site/business and select a plan capable of booking payments; compare checkout-specific Cyprus availability before purchase. [12] [13]
3. Add Wix Bookings and configure the four KLUB services.
4. Define cancellation, reschedule, booking-window and capacity policy; set group class capacity to six.
5. Create packages/memberships only after confirming final commercial terms, expiry and intro-pack eligibility.
6. Update the `Astro` dependency to v5 on a proof-of-concept branch and run regression checks.
7. Link the branch as a Wix-managed headless project and deploy a preview.
8. Implement one `/book/` proof of concept: discover a service, view slots, redirect to secure checkout.
9. Audit SEO: title, description, canonical, Open Graph, sitemap, schema, robots and redirects.
10. Run a scripted release checklist with a non-owner test customer before accepting production payments.

## Success Metrics

The move is successful when: the new KLUB page maintains the current visual brand; every booking CTA reaches an operational booking flow; new clients can purchase the correct package; a capacity-six class cannot be overfilled under normal flow; confirmation and reminder communications arrive; content owners can update the correct variables without searching code; and no current indexed page loses its intended title, description or route without a redirect.

## References

[1]: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project "Connect an Existing Astro Project — Wix Developers"
[2]: https://dev.wix.com/docs/go-headless/get-started/choose-your-development-path "Choose Your Development Path — Wix Developers"
[3]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/introduction "About Wix Bookings — Wix Developers"
[4]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/architecture "Wix Bookings Architecture — Wix Developers"
[5]: https://support.wix.com/en/article/wix-bookings-setting-up-your-booking-policies "Wix Bookings: Setting Up Your Booking Policies"
[6]: https://support.wix.com/en/article/wix-bookings-adding-and-setting-up-waitlists "Wix Bookings: Adding and Managing Waitlists for Classes"
[7]: https://dev.wix.com/docs/go-headless/self-managed-headless/tutorials/java-script-sdk-tutorials/bookings-quick-start "Bookings Quick Start — Wix Developers"
[8]: https://dev.wix.com/docs/api-reference/business-solutions/bookings/flow-single-service-booking "Single-Service Booking Flow — Wix Developers"
[9]: https://support.wix.com/en/article/wix-studio-about-the-studio-editor "Wix Studio: About the Studio Editor"
[10]: https://support.wix.com/en/article/studio-editor-designing-across-breakpoints "Studio Editor: Designing Across Breakpoints"
[11]: https://support.wix.com/en/article/cms-content-management-system-an-overview "CMS: An Overview — Wix Help Center"
[12]: https://support.wix.com/en/article/wix-bookings-about-wix-bookings "Wix Bookings: About Wix Bookings"
[13]: https://support.wix.com/en/article/choosing-a-premium-plan "Choosing a Premium Plan — Wix Help Center"
