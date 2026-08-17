// Class copy is editable in the CMS (src/content/classes.json). Images and
// their alt text stay here — they change rarely and are tied to the layout.
import content from '../content/classes.json';

export interface ClassInfo {
  slug: string;
  name: string;
  duration: string;
  capacity: string;
  price: string;
  short: string;
  image: string;
  imageAlt: string;
}

const IMAGES: Record<string, { image: string; imageAlt: string }> = {
  'reformer-fundamentals': {
    image: '/images/equipment-wall.jpg',
    imageAlt: 'Black reformer Pilates springs and equipment displayed in arched niches at KLUB studio Limassol',
  },
  'reformer-flow': {
    image: '/images/studio-room.jpg',
    imageAlt: 'Softly lit reformer Pilates studio room with sheer curtains and equipment shelving at KLUB Limassol',
  },
  'reformer-power': {
    image: '/images/mat-studio.jpg',
    imageAlt: 'Open movement studio floor with mats and natural light at KLUB Pilates Limassol',
  },
  'private-sessions': {
    image: '/images/interior-arch.jpg',
    imageAlt: 'Calm arched interior with warm lighting at KLUB Pilates studio in Limassol city center',
  },
};

export const CLASSES: ClassInfo[] = content.classes.map((c) => ({
  slug: c.slug,
  name: c.name,
  duration: c.duration,
  capacity: c.capacity,
  price: c.price,
  short: c.short,
  ...(IMAGES[c.slug] ?? { image: '/images/interior-arch.jpg', imageAlt: c.name }),
}));
