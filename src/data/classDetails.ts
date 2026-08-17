// Long-form class content — editable in the CMS (src/content/classes.json).
import content from '../content/classes.json';
import { CLASSES, type ClassInfo } from './classes';

export interface ClassDetail extends ClassInfo {
  level: string;
  intro: string[];
  expect: string[];
  goodFor: string[];
  seoTitle: string;
  seoDescription: string;
}

export const CLASS_DETAILS: ClassDetail[] = CLASSES.map((c) => {
  const d = content.classes.find((x) => x.slug === c.slug)!;
  return {
    ...c,
    level: d.level,
    intro: d.intro,
    expect: d.expect,
    goodFor: d.goodFor,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
  };
});
