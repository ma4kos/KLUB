import { CLASSES, type ClassInfo } from './classes';

export interface ClassDetail extends ClassInfo {
  level: string;
  intro: string[];
  expect: string[];
  goodFor: string[];
  seoTitle: string;
  seoDescription: string;
}

const details: Record<string, Omit<ClassDetail, keyof ClassInfo>> = {
  'reformer-fundamentals': {
    level: 'Beginner-friendly',
    seoTitle: 'Reformer Fundamentals Class | Beginner Pilates Limassol | KLUB',
    seoDescription:
      'Never tried reformer Pilates? Our Fundamentals class in Limassol teaches you the machine from zero. 50 minutes, max 6 people, taught in English. First class €20.',
    intro: [
      'If you have never stepped onto a reformer — or it has been a while — this is where you start. Fundamentals is a slow, deliberate introduction to the machine: the carriage, the springs, the straps, and how your body works with each of them.',
      'Your instructor walks the room the whole time. With six people maximum, nobody gets lost in the back row. You will leave knowing the foundational movements that every other class builds on — and why your core feels like it just woke up.',
    ],
    expect: [
      'A full tour of the reformer before you move',
      'Foundational exercises: footwork, bridging, arm work, basic core series',
      'Constant hands-on guidance and modifications for your body',
      'A calm pace — strength over speed',
    ],
    goodFor: [
      'Complete beginners',
      'Anyone returning to movement after a break or injury',
      'Experienced movers who want to refine their technique',
    ],
  },
  'reformer-flow': {
    level: 'All levels',
    seoTitle: 'Reformer Flow Class | Dynamic Pilates Limassol | KLUB',
    seoDescription:
      'Reformer Flow at KLUB Limassol: 50 minutes of smooth, breath-led sequences that build stamina, coordination and control. Small groups of six, taught in English.',
    intro: [
      'Flow is where the reformer starts to feel like dancing. Movements link into continuous, breath-led sequences — one exercise melting into the next — so you build stamina and coordination without ever feeling rushed.',
      'Rooted in classical technique and shaped by our ballet heritage, Flow rewards you for showing up regularly: the choreography becomes familiar, and then it becomes yours.',
    ],
    expect: [
      'Continuous sequences with minimal stops',
      'Breath-led pacing that builds endurance',
      'Full-body work: legs, core, arms, back',
      'Options to add or reduce intensity every round',
    ],
    goodFor: [
      'Anyone comfortable with reformer basics',
      'Those who love rhythm and momentum in a workout',
      'Building lean, functional strength week over week',
    ],
  },
  'reformer-power': {
    level: 'Intermediate–advanced',
    seoTitle: 'Reformer Power Class | Advanced Pilates Limassol | KLUB',
    seoDescription:
      'Reformer Power at KLUB Limassol: higher resistance, faster transitions and dynamic sequences for experienced movers. 50 minutes, max 6 people. Book your spot.',
    intro: [
      'Power is our strongest class. Heavier springs, quicker transitions, longer holds — designed for movers who know the reformer and want to be challenged by it.',
      'Expect to work close to your edge, safely. The group stays capped at six, so intensity never comes at the cost of technique.',
    ],
    expect: [
      'Increased spring resistance and tempo',
      'Dynamic sequences including jumpboard and plank series',
      'Progressions layered through the class',
      'A proper burn — and a proper cool-down',
    ],
    goodFor: [
      'Experienced reformer clients ready to progress',
      'Athletes cross-training for strength and control',
      'Regulars who have outgrown Flow and want more',
    ],
  },
  'private-sessions': {
    level: 'Every level — fully personalized',
    seoTitle: 'Private Pilates Sessions | 1-to-1 Training Limassol | KLUB',
    seoDescription:
      'Private 1-to-1 reformer Pilates in Limassol city center. Personalized sessions for injury recovery, pre/post-natal training and athletic goals. From €70 per session.',
    intro: [
      'One reformer, one instructor, one plan built entirely around you. Private sessions are the fastest way to progress — every minute of the 50 is calibrated to your body, your history and your goals.',
      'They are also the right choice when a group setting is not: recovering from injury, training through or after pregnancy, or simply preferring privacy and a schedule that bends to yours. Our instructors are certified in pre- and post-natal movement, so you are in qualified hands at every stage.',
    ],
    expect: [
      'A movement assessment in your first session',
      'A program designed for your specific goals',
      'Pre/post-natal certified instruction when you need it',
      'Flexible scheduling by appointment',
    ],
    goodFor: [
      'Injury recovery and rehabilitation support',
      'Pre- and post-natal training',
      'Athletic conditioning and sport-specific goals',
      'Anyone who wants undivided attention',
    ],
  },
};

export const CLASS_DETAILS: ClassDetail[] = CLASSES.map((c) => ({ ...c, ...details[c.slug] }));
