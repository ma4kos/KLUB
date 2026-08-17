// Central place for studio facts. Brand constants live here; everything a
// non-developer might change lives in src/content/studio.json (editable via
// the CMS at /admin/ — see README).
import studio from './content/studio.json';

export const SITE = {
  name: 'KLUB Pilates Studio',
  shortName: 'KLUB',
  tagline: 'Intentional Movement. Mindful Strength. Real Connection.',
  url: 'https://klub.cy',
  addressCountry: 'Cyprus',
  openingDate: '2026-09-01',

  // Editable in the CMS: contact details, address, socials, banner, booking URL
  ...studio,
};

export const BANNER = studio.banner;

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
