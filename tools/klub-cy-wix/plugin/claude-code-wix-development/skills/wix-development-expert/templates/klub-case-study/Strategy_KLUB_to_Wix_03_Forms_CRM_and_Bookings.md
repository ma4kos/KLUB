# KLUB to Wix Migration Design: Forms, CRM, and Bsport

## Executive Summary

KLUB’s migration uses the existing Wix site as a self-managed Headless backend while preserving **Bsport** as the booking system. Wix Forms and CRM may replace Netlify form handling after the two source form schemas, consent language, success behavior, notifications, and duplicate controls have been reproduced and tested. Wix Bookings is not part of this migration unless the business separately approves a booking-platform change.

## Source-to-Target Mapping

| KLUB source | Approved target | Rule |
|---|---|---|
| Contact form | Wix Form plus server-side submission adapter | Preserve name, email, optional phone, message, privacy link, error recovery, and accessible success state |
| Founding-member form | Wix Form plus server-side submission adapter | Preserve source page, name, email, optional phone, interest, explicit consent, analytics event, and accessible success state |
| Contact creation | Wix CRM Contact V4, only when required | Query/read before creation and keep `allowDuplicates` false; do not silently create duplicate contacts or marketing consent |
| Notifications | Wix Automations or a reviewed server notification | Configure only after a real test submission proves delivery and consent handling |
| Spam control | Wix Forms/bot controls plus server validation | Preserve the source honeypot/validation outcome rather than assuming a platform control is sufficient |
| Booking CTAs | Existing `/book/` route | Keep the current site-local booking destination unless `bookingUrl` is intentionally configured |
| Booking calendar | Bsport widget | Preserve company `6604`, widget `868966`, `https://cdn.bsport.io/scripts/widget.js`, and the current calendar configuration |
| Wix Bookings | Not used | Do not provision services or migrate schedules without a separate approved business decision |

## Implementation Contract

Query Wix Forms before creation. If the target has no compatible form, retrieve the current Create Form and Create Submission schemas and create no more than two schemas. Administrative form-submission or CRM calls must run server-side; the Wix account API key must never enter the Astro browser bundle.

Use the live Wix CRM Create Contact V4 schema when direct contact creation is necessary. Its REST request includes `allowDuplicates`; keep the value false and reconcile the result by email/stable source identity.[1]

The Bsport embed is a source-owned business flow rather than an asset to convert. Validate `src/content/studio.json`, `src/components/BsportWidget.astro`, `src/pages/book.astro`, `src/site.ts`, the production build output, the Bsport CDN response, and one real-browser mount without submitting a booking. Preserve the source analytics event names for booking CTAs.

## Acceptance Criteria

| Gate | Acceptance |
|---|---|
| Forms | Both source workflows preserve fields, required/optional behavior, consent, errors, status announcements, and success behavior |
| CRM | No duplicate contact is created; consent provenance and source page are retained |
| Notifications | Intended owner/user notification is proven with an approved test recipient |
| Accessibility | Keyboard, focus, labels, validation errors, status messages, contrast, and motion checks pass |
| Bsport | Company `6604`, widget `868966`, `/book/` fallback, compiled embed, CDN, and real-browser calendar mount pass |
| Regression | Existing form and booking tests pass, and no Wix Bookings dependency is introduced |
| Recovery | The previous Netlify form path can be restored and no contacts are automatically deleted |

## References

[1]: https://dev.wix.com/docs/api-reference/crm/members-contacts/contacts/contacts/contact-v4/create-contact "Wix Create Contact V4"
[2]: https://github.com/ma4kos/KLUB/blob/15ec3d93f187f5ec12bee14e8bd7b11692220002/tests/forms.spec.ts "KLUB form tests"
[3]: https://github.com/ma4kos/KLUB/blob/15ec3d93f187f5ec12bee14e8bd7b11692220002/src/components/BsportWidget.astro "KLUB Bsport widget"
