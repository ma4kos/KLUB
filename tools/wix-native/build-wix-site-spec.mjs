#!/usr/bin/env node
/**
 * Generates the native-Wix rebuild specification from this repository's live
 * content, so the spec can never drift from the site it describes.
 *
 * WHY THIS EXISTS. Alex wants a site he can restructure himself in the Wix
 * editor — not the Astro app hosted on Wix (that keeps every structural change
 * a developer job). A native rebuild therefore recreates the page structure
 * with Wix's own sections and elements. Everything that must survive that move
 * — the copy, the prices, the class list, the SEO, the image set, the design
 * tokens — is already modelled in src/content/*.json, and this script emits it
 * in one machine-readable document a Wix-connected agent can execute against.
 *
 * Run: node tools/wix-native/build-wix-site-spec.mjs
 * Out: tools/wix-native/klub-wix-site-spec.json
 */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

const home = read('src/content/home.json');
const studio = read('src/content/studio.json');
const classes = read('src/content/classes.json');
const pricing = read('src/content/pricing.json');
const faq = read('src/content/faq.json');
const page = (n) => read(`src/content/pages/${n}.json`);

/** Strip the CMS emphasis markers; Wix text elements take plain strings. */
const plain = (s) =>
  typeof s === 'string' ? s.replace(/\*(.+?)\*/g, '$1').replace(/~(.+?)~/g, '$1') : s;

/** Every image referenced by the content, deduped, with on-disk size. */
function mediaManifest() {
  const seen = new Map();
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') return Object.values(node).forEach(walk);
    if (typeof node === 'string' && /^\/(images|videos)\/.+\.(jpg|jpeg|png|webp|mp4)$/i.test(node)) {
      if (seen.has(node)) return;
      const abs = join(ROOT, 'public', node.replace(/^\//, ''));
      seen.set(node, {
        path: node,
        exists: existsSync(abs),
        bytes: existsSync(abs) ? statSync(abs).size : 0,
        kind: /\.mp4$/i.test(node) ? 'video' : 'image',
      });
    }
  };
  [home, studio, classes, pricing, faq,
   page('about'), page('instructors'), page('location'), page('classes-index'),
   page('book'), page('contact'), page('founding'), page('policies'), page('timetable')]
    .forEach(walk);
  return [...seen.values()].sort((a, b) => a.path.localeCompare(b.path));
}

const spec = {
  $comment:
    'Native Wix rebuild specification for KLUB. Generated from src/content/*.json — regenerate, do not hand-edit.',
  generatedAt: new Date().toISOString().slice(0, 10),
  generatedFrom: { repository: 'https://github.com/ma4kos/KLUB', branch: 'main' },

  site: {
    name: 'KLUB — Keep Living Under Balance',
    businessType: 'Pilates studio',
    locale: 'en',
    country: 'CY',
    productionDomain: 'www.keeplivingunderbalance.com',
    domainNote:
      'Do NOT connect the domain during the build. It currently serves the studio\'s existing Wix site. Cut over only on explicit instruction.',
  },

  // Wix site theme. These are the exact tokens the current site ships.
  theme: {
    colors: {
      background: '#F7F3EE', card: '#FFFFFF', sand: '#E8DFD3',
      ink: '#1A1714', inkSoft: '#5C544C', inkFaint: '#6B6259',
      accent: '#7A6A55', accentDeep: '#5C4F3D', line: '#E8E0D6',
    },
    fonts: {
      display: { family: 'DM Serif Display', fallback: 'Georgia, serif', usage: 'headings' },
      body: { family: 'DM Sans', fallback: 'system sans-serif', usage: 'body, buttons, nav' },
    },
    radius: { card: 16, button: 12, small: 8 },
    contentWidth: 1200,
    voice:
      'Warm, editorial, unhurried. Headings in the serif; one italic accent word per heading is the house style.',
  },

  navigation: {
    header: [
      { label: 'Classes', target: '/classes' },
      { label: 'Schedule', target: '/book', note: 'the live bsport calendar' },
      { label: 'Memberships', target: '/pricing' },
      { label: 'About', target: '/about' },
      { label: 'Location', target: '/location' },
    ],
    headerCta: { label: studio.ctaLabel, target: '/book' },
    footerExtra: ['Instructors', 'FAQ', 'Contact', 'Policies', 'Founding Member'],
  },

  // The homepage, section by section, in Alex's Option-1 order.
  homepage: {
    seo: home.seo,
    sections: [
      { n: 'hero', layout: 'split-text-left-image-right',
        heading: plain(home.heroHeading), headingStyle: 'uppercase, letter-spaced 0.14em, serif',
        body: home.heroLede,
        buttons: [
          { label: studio.ctaLabel, style: 'primary-dark', target: '/book' },
          { label: home.heroSecondaryLabel, style: 'outline', target: '/about' },
        ],
        image: home.heroImage, imageAlt: home.heroAlt },
      { n: '01', title: 'The Klub', layout: 'split-text-left-image-right',
        heading: plain(home.about.heading), body: home.about.text,
        link: { label: home.about.buttonLabel, target: '/about' },
        image: home.about.image, imageAlt: home.about.alt },
      { n: '02', title: 'Find Your Balance', layout: 'text-left-2x2-cards-right',
        heading: plain(home.classesHead.heading), body: home.classesHead.lede,
        link: { label: home.classesHead.buttonLabel, target: '/classes' },
        cards: classes.classes.map((c) => ({
          image: c.image, imageAlt: c.imageAlt,
          title: c.name.toUpperCase(), caption: c.short, target: `/classes/${c.slug}`,
        })) },
      { n: '03', title: 'Start Here', layout: 'split-text-left-image-right',
        heading: plain(home.intro.heading), offerLine: home.intro.offer.toUpperCase(),
        checklist: home.intro.includes,
        buttons: [{ label: home.intro.buttonLabel, style: 'primary-dark', target: '/book' }],
        image: home.intro.image, imageAlt: home.intro.alt },
      { n: '04', title: 'The KLUB Experience', layout: 'text-left-two-images-right',
        heading: plain(home.experience.heading), body: home.experience.text,
        link: { label: home.experience.buttonLabel, target: '/about' },
        images: home.experience.gallery },
      { n: '05', title: 'Move With Us', layout: 'text-then-full-width-image',
        background: 'sand', heading: plain(home.community.heading), body: home.community.lede,
        subLink: { label: home.community.locationLine, target: '/location' },
        link: { label: home.community.buttonLabel, target: '/instructors' },
        image: home.community.image, imageAlt: home.community.alt },
      { n: '06', title: 'Find Us', layout: 'split-text-left-image-right',
        heading: plain(home.location.heading),
        address: [studio.streetAddress, `${studio.addressLocality}, Cyprus`].filter(Boolean),
        parking: home.location.parking,
        buttons: [
          { label: home.location.directionsLabel, style: 'outline', target: '/location' },
          { label: home.location.messageLabel, style: 'accent', target: 'whatsapp-or-instagram' },
        ],
        image: home.location.image, imageAlt: home.location.alt },
      { n: '07', title: 'Closing', layout: 'dark-split-text-left-image-right',
        background: 'ink', heading: plain(home.closing.heading),
        headingStyle: 'uppercase, letter-spaced 0.14em, serif',
        body: home.closing.text,
        buttons: [{ label: home.closing.buttonLabel, style: 'light', target: '/book' }],
        image: home.closing.image, imageAlt: home.closing.alt,
        below: { element: 'wix-form', ref: 'foundingMemberForm' } },
    ],
  },

  pages: [
    { slug: '/classes', title: 'Classes', seo: page('classes-index').seo,
      content: { hero: page('classes-index').hero, items: classes.classes } },
    ...classes.classes.map((c) => ({
      slug: `/classes/${c.slug}`, title: c.name, seo: c.seo ?? null, content: c,
    })),
    { slug: '/pricing', title: 'Memberships', seo: pricing.seo, content: pricing },
    { slug: '/book', title: 'Book a Class', seo: page('book').seo,
      content: page('book'),
      criticalElement: { type: 'html-embed', ref: 'bsportCalendar' } },
    { slug: '/about', title: 'About', seo: page('about').seo, content: page('about') },
    { slug: '/instructors', title: 'Our Instructors', seo: page('instructors').seo,
      content: page('instructors') },
    { slug: '/location', title: 'Location', seo: page('location').seo, content: page('location') },
    { slug: '/faq', title: 'FAQ', seo: faq.seo, content: faq },
    { slug: '/contact', title: 'Contact', seo: page('contact').seo, content: page('contact') },
    { slug: '/founding-member', title: 'Founding Member', seo: page('founding').seo,
      content: page('founding') },
    { slug: '/policies', title: 'Policies', seo: page('policies').seo, content: page('policies') },
  ],

  // Things that are NOT plain content and must be built deliberately.
  integrations: {
    bsportCalendar: {
      why: 'Bookings stay in bsport — it is the studio\'s live booking and payment system. Do not rebuild bookings in Wix Bookings.',
      placement: 'Custom HTML embed on /book, full content width, min-height 560px.',
      companyId: studio.bsportCompanyId,
      widgetId: studio.bsportWidgetId,
      loader: 'https://cdn.bsport.io/scripts/widget.js',
      mount: {
        parentElement: `bsport-widget-${studio.bsportWidgetId}`,
        companyId: Number(studio.bsportCompanyId), franchiseId: null,
        dialogMode: 3, widgetType: 'calendar', showFab: false, fullScreenPopup: false,
        config: { calendar: { todayOnly: false, cardMode: false, variant: 'activityName' } },
      },
    },
    foundingMemberForm: {
      why: 'The only pre-launch conversion. Rebuild as a native Wix Form so submissions land in the Wix dashboard.',
      fields: [
        { name: 'email', type: 'email', required: true, label: 'Email' },
        { name: 'interest', type: 'dropdown', required: false,
          label: 'What interests you most?', options: studio.foundingForm.interestOptions },
        { name: 'consent', type: 'checkbox', required: true,
          label: 'Keep me posted about KLUB\'s opening and founding-member offers, and I accept the privacy policy.' },
      ],
      submitLabel: studio.foundingForm.submitLabel,
      placement: 'Homepage below section 07, plus /founding-member and /book.',
    },
    analytics: {
      ga4: studio.ga4Id || null,
      clarity: studio.clarityId || null,
      note: 'Both empty today. Alex already uses Clarity and finds it useful — add both in Wix Marketing Integrations, and add a cookie-consent banner before any paid traffic (EU).',
      conversionEvent: 'Track clicks on every Book control; that is the metric Alex optimises for.',
    },
    socials: {
      instagram: studio.instagram, facebook: studio.facebook, tiktok: studio.tiktok,
      whatsapp: studio.whatsappNumber || null,
    },
    contact: { email: studio.email, phone: studio.phoneDisplay || null },
  },

  media: mediaManifest(),

  doNot: [
    'Do not name Izzy, link her personal socials, or identify her as owner — a standing regulatory constraint on all public content.',
    'Do not connect www.keeplivingunderbalance.com during the build; it serves the existing site.',
    'Do not rebuild bookings in Wix Bookings — bsport stays.',
    'Do not touch the KLUB-CY site 20f11f6f-… ; it is an unrelated empty sandbox.',
    'Do not invent prices, class names or an address — every value here comes from the live content model.',
  ],
};

const out = 'tools/wix-native/klub-wix-site-spec.json';
writeFileSync(join(ROOT, out), JSON.stringify(spec, null, 2) + '\n');
const missing = spec.media.filter((m) => !m.exists);
console.log(`wrote ${out}`);
console.log(`  pages:    ${spec.pages.length + 1} (incl. homepage)`);
console.log(`  sections: ${spec.homepage.sections.length} on the homepage`);
console.log(`  media:    ${spec.media.length} files, ${missing.length} missing`);
if (missing.length) console.log('  MISSING:', missing.map((m) => m.path).join(', '));
