// Central place for studio facts. Update these once and the whole site follows.
export const SITE = {
  name: 'KLUB Pilates Studio',
  shortName: 'KLUB',
  tagline: 'Intentional Movement. Mindful Strength. Real Connection.',
  url: 'https://klub-cy.com',
  email: 'team@klub-cy.com',

  // TODO: fill in when confirmed — digits only, international format, no "+" (e.g. "35799123456")
  whatsappNumber: '',
  // TODO: fill in when confirmed (e.g. "+357 99 123 456")
  phoneDisplay: '',
  // TODO: exact street address once announced
  streetAddress: '',

  addressLocality: 'Limassol City Center',
  addressCountry: 'Cyprus',
  addressNote: 'Full street address announced soon — join the list to be first to know.',

  instagram: 'https://www.instagram.com/klubstudios',
  instagramHandle: '@klubstudios',

  openingLabel: 'Opening September 2026',
  openingDate: '2026-09-01',
};

export function whatsappLink(message = "Hi KLUB! I'd like to book a class. Can you help me?") {
  if (SITE.whatsappNumber) {
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
  // Fallback until the WhatsApp Business number is confirmed
  return SITE.instagram;
}
