// Central place for studio facts. Brand constants live here; everything a
// non-developer might change lives in src/content/studio.json (editable via
// the CMS at /admin/ — see README).
import studio from './content/studio.json';

export const SITE = {
  name: 'KLUB Pilates Studio',
  shortName: 'KLUB',
  tagline: 'Intentional Movement. Mindful Strength. Real Connection.',
  url: 'https://www.keeplivingunderbalance.com',
  addressCountry: 'Cyprus',
  openingDate: '2026-09-01',

  // Editable in the CMS: contact details, address, socials, banner, booking URL
  ...studio,
};

export const BANNER = studio.banner;

// The email address is CMS-editable and its validation pattern only forbids
// `@` and whitespace, so it can legally contain `?`, `&`, `#` and `=`. Dropped
// straight into a mailto: href those become headers — an address like
// `x?subject=Hi&cc=someone@example.com` would pre-fill a visitor's mail client
// with attacker-chosen fields. Percent-encoding the address neutralises that;
// `%40` is valid in a mailto: URI (RFC 6068) and every mail client resolves it.
// Use this everywhere instead of interpolating SITE.email into a href.
export function mailtoLink(email = SITE.email) {
  return `mailto:${encodeURIComponent(email)}`;
}

export function whatsappLink(message = "Hi KLUB! I'd like to book a class. Can you help me?") {
  if (SITE.whatsappNumber) {
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
  // Fallback until the WhatsApp Business number is confirmed
  return SITE.instagram;
}

// Where "Book" buttons point. Once a live booking URL (e.g. Wix Bookings) is
// set in the CMS, every Book button on the site switches to it automatically.
export function bookLink() {
  return SITE.bookingUrl || '/book/';
}

// The one primary CTA label, repeated verbatim wherever the main Book action
// appears (hero, sticky bar, closing section) — editable once in the CMS.
export function primaryCta() {
  return SITE.ctaLabel || 'Book Your First Class — €20';
}

// Compact variant for tight surfaces (the slim desktop header below 1100px):
// keeps the price anchor without crowding the nav.
export function ctaCompact() {
  return SITE.ctaCompact || 'Book · €20';
}
