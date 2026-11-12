// The schedule of daily editions. One entry per edition, in order. Everything an edition SAYS lives in
// its own folder, src/editions/<slug>/. This list only says WHEN it appears and what the home page and
// the archive show about it.
//
// How publishing works (see README, "Daily editions"):
// - status 'draft': being made. Built only in `npm run dev`, never on the live site.
// - status 'ready': checked and scheduled. It is built, and it opens for everyone at midnight
//   (Europe/Amsterdam) on its date. Before that its page only says when it opens, unless you add
//   ?preview to the address.
// - Numbers count up by one, dates go forward, and no two editions share a day. The build stops with
//   a clear message when that is not true.
//
// This file has no imports on purpose, so tools/schedule.mjs can read it with plain Node.

export type EditionStatus = 'draft' | 'ready';

export interface Edition {
  /** Its number in the series, and its address: /daily/<number>/ */
  number: number;
  /** The folder in src/editions that holds its content and pictures. */
  slug: string;
  /** The day it opens, 'YYYY-MM-DD', in the publication time zone. */
  date: string;
  status: EditionStatus;
  /** A short title, a few words. */
  title: string;
  /** The one question the edition answers. Shown big on the home page. */
  question: string;
  /** One or two sentences on why it is worth seven minutes. No spoilers. */
  teaser: string;
  /** About how long it takes, in minutes. */
  minutes: number;
  /** One word for the kind of subject: Space, Maths, Technology... */
  subject: string;
  /** The edition's own colour (hex). Cream or near-black text is picked for it. */
  accent: string;
  /** What a reader can do afterwards. Shown at the start, checked by the questions at the end. */
  goals: string[];
  /** The library explainer it grew from, if any (a slug from src/data/topics.ts). */
  basedOn?: string;
}

export const editions: Edition[] = [
  {
    number: 1,
    slug: 'closer-and-colder',
    date: '2026-11-12',
    status: 'ready',
    title: 'Closer to the Sun, colder outside',
    question: 'The Earth is closest to the Sun in January. So why is January cold?',
    teaser:
      'Every day this autumn the Earth moves a little closer to the Sun, and every day it gets a little colder in Europe. Two switches on a model of the Earth show which explanation holds up.',
    minutes: 7,
    subject: 'Space',
    accent: '#1F4E79',
    goals: [
      'Explain what causes the seasons, and why the distance to the Sun does not.',
      'Use the angle of sunlight and the length of the day to say how strong the sunlight is at a place and time.',
      'Predict the seasons in another hemisphere, on an Earth without tilt, and on Mars.',
    ],
    basedOn: 'why-we-have-seasons',
  },
  {
    number: 2,
    slug: 'twenty-three-strangers',
    date: '2026-11-13',
    status: 'ready',
    title: 'Twenty-three strangers',
    question: 'How many people does it take before two of them probably share a birthday?',
    teaser:
      'Half the squads at the 2014 World Cup had two players born on the same day. Run a thousand parties and find out whether that was luck.',
    minutes: 7,
    subject: 'Maths',
    accent: '#8C2F4B',
    goals: [
      'Explain why shared birthdays turn up in surprisingly small groups.',
      'Tell apart "any two people match" and "someone matches me".',
      'Estimate when random codes or numbers start to repeat.',
    ],
    basedOn: 'why-shared-birthdays-are-common',
  },
  {
    number: 3,
    slug: 'the-check-digit',
    date: '2026-11-14',
    status: 'ready',
    title: 'The digit that checks the others',
    question: 'How does a barcode scanner know it has misread a code?',
    teaser:
      'The last digit of a supermarket barcode says nothing about the product. Try to slip a mistake past the scanner, and find the one kind it misses.',
    minutes: 8,
    subject: 'Technology',
    accent: '#2F6B4F',
    goals: [
      'Explain how one check digit catches every single wrong digit in a barcode.',
      'Say which swapped digits a barcode check cannot catch, and why.',
      'Judge whether another check digit rule is stronger or weaker.',
    ],
    basedOn: 'how-a-barcode-is-read',
  },
];

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Stops the build when the schedule does not add up. Returns the list sorted by number. */
export function checkSchedule(list: Edition[]): Edition[] {
  const sorted = [...list].sort((a, b) => a.number - b.number);
  const problems: string[] = [];
  sorted.forEach((e, i) => {
    const name = `Edition ${e.number} (${e.slug})`;
    if (e.number !== i + 1) problems.push(`${name}: numbers must run 1, 2, 3... without gaps. Expected ${i + 1}.`);
    if (!DAY.test(e.date) || Number.isNaN(Date.parse(`${e.date}T12:00:00Z`))) problems.push(`${name}: date "${e.date}" is not YYYY-MM-DD.`);
    if (i > 0 && e.date <= sorted[i - 1].date) problems.push(`${name}: its date ${e.date} must come after edition ${sorted[i - 1].number} (${sorted[i - 1].date}).`);
    if (!['draft', 'ready'].includes(e.status)) problems.push(`${name}: status must be 'draft' or 'ready'.`);
    for (const key of ['slug', 'title', 'question', 'teaser', 'subject', 'accent'] as const) {
      if (!String(e[key] ?? '').trim()) problems.push(`${name}: ${key} is empty.`);
    }
    if (!(e.minutes >= 3 && e.minutes <= 12)) problems.push(`${name}: minutes should be between 3 and 12.`);
    if (!e.goals.length) problems.push(`${name}: add at least one learning goal.`);
  });
  // A ready edition after a draft would leave a hole in the published series
  const firstDraft = sorted.find((e) => e.status === 'draft');
  if (firstDraft) {
    for (const e of sorted) {
      if (e.status === 'ready' && e.number > firstDraft.number) problems.push(`Edition ${e.number} is ready, but edition ${firstDraft.number} before it is still a draft.`);
    }
  }
  const slugs = new Set<string>();
  for (const e of sorted) {
    if (slugs.has(e.slug)) problems.push(`Two editions use the slug "${e.slug}".`);
    slugs.add(e.slug);
  }
  if (problems.length) throw new Error(`The edition schedule in src/data/editions.ts has problems:\n- ${problems.join('\n- ')}`);
  return sorted;
}

/** The editions that are built: every ready one, and drafts too while developing. */
export function getEditions(includeDrafts = false): Edition[] {
  return checkSchedule(editions).filter((e) => includeDrafts || e.status === 'ready');
}

export const editionPath = (e: Pick<Edition, 'number'>) => `/daily/${e.number}/`;
