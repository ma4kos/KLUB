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

export const CLASSES: ClassInfo[] = [
  {
    slug: 'reformer-fundamentals',
    name: 'Reformer Fundamentals',
    duration: '50 min',
    capacity: 'Max 6 people',
    price: 'From €20',
    short: 'Perfect for beginners. Learn the machine, master the basics, build confidence.',
    image: '/images/equipment-wall.jpg',
    imageAlt: 'Black reformer Pilates springs and equipment displayed in arched niches at KLUB studio Limassol',
  },
  {
    slug: 'reformer-flow',
    name: 'Reformer Flow',
    duration: '50 min',
    capacity: 'Max 6 people',
    price: 'From €20',
    short: 'Smooth, continuous movement for those ready to build stamina and grace.',
    image: '/images/studio-room.jpg',
    imageAlt: 'Softly lit reformer Pilates studio room with sheer curtains and equipment shelving at KLUB Limassol',
  },
  {
    slug: 'reformer-power',
    name: 'Reformer Power',
    duration: '50 min',
    capacity: 'Max 6 people',
    price: 'From €20',
    short: 'Intensified resistance, dynamic sequences. For the experienced mover.',
    image: '/images/mat-studio.jpg',
    imageAlt: 'Open movement studio floor with mats and natural light at KLUB Pilates Limassol',
  },
  {
    slug: 'private-sessions',
    name: 'Private Sessions',
    duration: '50 min',
    capacity: '1-to-1',
    price: 'From €70',
    short: 'Training tailored to your body, your goals, your schedule.',
    image: '/images/interior-arch.jpg',
    imageAlt: 'Calm arched interior with warm lighting at KLUB Pilates studio in Limassol city center',
  },
];
