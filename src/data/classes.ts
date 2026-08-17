// Class content — including photos — is editable in the CMS (src/content/classes.json).
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

export const CLASSES: ClassInfo[] = content.classes.map((c) => ({
  slug: c.slug,
  name: c.name,
  duration: c.duration,
  capacity: c.capacity,
  price: c.price,
  short: c.short,
  image: c.image,
  imageAlt: c.imageAlt,
}));
