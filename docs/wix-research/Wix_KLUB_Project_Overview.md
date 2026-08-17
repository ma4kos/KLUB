# Wix KLUB Project Files — Overview

**Purpose:** This is the entry point for the KLUB Wix migration package. Read this file first, then open the file that matches the implementation decision.

## Recommended Starting Point

The recommended end state is **Wix-managed Headless + the existing Astro frontend + native Wix Bookings**. This preserves KLUB’s current design/code while putting bookings, payments, operations, member-facing functions and optionally hosting inside Wix. It requires an Astro 4 → Astro 5 proof-of-concept upgrade before the documented existing-project link path can be used. [1]

If booking must launch before the proof of concept is ready, configure Wix Bookings and point the existing website’s booking CTAs to the Wix booking flow. If the non-technical team must edit page layout visually after launch, choose the manual Wix Studio rebuild route instead. [2] [3]

> **Non-negotiable implementation fact:** The existing Astro codebase cannot be imported as editable Wix Studio/Wix Editor pages. The code can be preserved using a headless route; otherwise the visual site must be rebuilt manually. [1] [2]

## File Map

| File | Read when | Contents |
|---|---|---|
| `Wix_KLUB_Knowledge_Base.md` | You need the complete decision reference. | Platform capabilities, Editor/Studio/Velo/Headless comparison, Bookings, CMS, plans, APIs, restrictions, examples, methods, SEO, accessibility, troubleshooting and sources. |
| `Wix_KLUB_Migration_Approach.md` | You need to choose or execute a migration path. | KLUB-specific architecture recommendation, phased implementation plan, decision criteria, risk controls and first ten work items. |
| `Wix_KLUB_Implementation_Templates.md` | You are building/configuring the site. | Thirty ready-to-use templates for Studio, CMS, Bookings, packages, policy, headless code, tests, SEO, roles and release sign-off. |
| `Wix_KLUB_Source_Inventory.md` | You are translating the existing site into Wix. | Current pages, data sources, assets, design tokens, content ownership and explicit mapping to Wix components. |

## Suggested Read Order by Role

| Role | First file | Then read |
|---|---|---|
| Founder / decision-maker | `Wix_KLUB_Migration_Approach.md` | Knowledge Base sections 1, 5, 7, 9, 15. |
| Wix Studio designer | Knowledge Base sections 3, 6, 10 | Implementation Templates 02–10, 25–30, Source Inventory. |
| Wix Bookings operator | Knowledge Base section 5 | Implementation Templates 11–16 and 30. |
| Astro / frontend developer | Migration Approach | Knowledge Base sections 8–9 and Templates 17–24. |
| SEO / marketing owner | Knowledge Base section 12 | Templates 10, 25–29 and Source Inventory. |

## First Practical Actions

1. Confirm operational facts: final address, opening date, provider/payment eligibility, timetable, prices, plan expiry, cancellation/no-show policy and contact details.
2. In Wix, create the business/site, add Wix Bookings, and configure four draft services: three Classes and one Appointment.
3. Test the current site’s booking-link hybrid pathway before changing production hosting.
4. Create a repository branch named `wix-headless-poc`, upgrade Astro 4 to Astro 5 and ensure the existing static build passes.
5. Link that branch through Wix’s documented existing-Astro headless setup, then build only one service-to-checkout proof of concept.
6. Use the release sign-off template before accepting a real customer payment.

## Package Rules for an LLM or Build Agent

Use **Wix Bookings as the authoritative operational system** for schedule, availability, booking status, capacity, attendance, package entitlement and client booking data. Use Wix CMS or the Astro content model for editorial content only. Do not create two independent timetables. Do not expose Wix credentials in the browser. Do not introduce a custom payment interface in the first release when secure Wix checkout is sufficient.

All factual platform claims are grounded in the official Wix sources cited inside each detailed file. Pricing, payment provider availability and plan features can vary by territory, currency and billing cadence; verify them from the authenticated Wix checkout before making a commercial commitment.

## References

[1]: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project "Connect an Existing Astro Project — Wix Developers"
[2]: https://dev.wix.com/docs/go-headless/get-started/choose-your-development-path "Headless Development Paths — Wix Developers"
[3]: https://support.wix.com/en/article/wix-studio-about-the-studio-editor "Wix Studio: About the Studio Editor"
