// The topic registry: one list that drives the homepage grid,
// the "next topic" links and the numbering. To add a topic, add an entry here
// and create src/pages/<slug>/index.astro (see README.md).

import type { Lang } from '../lib/text';

export type TopicStatus = 'live' | 'draft';

/** A topic page written in another language. It shows up at /<language>/<slug>/. */
export interface TopicTranslation {
  slug: string;
  title: string;
  hook: string;
  category: string;
}

export interface Topic {
  /** URL part and folder name: src/pages/<slug>/index.astro */
  slug: string;
  title: string;
  /** One line that makes people want to click. */
  hook: string;
  category: string;
  /** The cover color (hex). Text and drawing colors on it are picked automatically. */
  accent: string;
  /** Name of an SVG file in src/previews, without ".svg". */
  preview: string;
  /** YYYY-MM-DD. Topics are ordered by this date, oldest first. */
  dateAdded: string;
  /** "draft" topics show up in `npm run dev` only. */
  status: TopicStatus;
  /** Other languages this topic is available in. The numbering and the category filter stay English. */
  translations?: { nl?: TopicTranslation };
  /** Which language the homepage card and the "next topic" cards lead to. English when left out. */
  hubLanguage?: Lang;
}

// The topics, in the order they were added.
export const topics: Topic[] = [
  {
    slug: 'gambits-in-chess',
    title: 'Gambits in chess',
    hook: 'Give away a pawn on purpose and see what you get for it.',
    category: 'Games',
    accent: '#9B2F36',
    preview: 'gambits-in-chess',
    dateAdded: '2026-10-02',
    status: 'live',
  },
  {
    slug: 'pyramids-in-peru',
    title: 'Pyramids in Peru',
    hook: 'Huge stepped pyramids, built thousands of years before the Incas.',
    category: 'Archaeology',
    accent: '#D9A441',
    preview: 'pyramids-in-peru',
    dateAdded: '2026-10-02',
    status: 'live',
  },
  {
    slug: 'the-dutch-golden-age',
    title: 'The Dutch Golden Age',
    hook: 'How a small country at the edge of Europe became a trading giant.',
    category: 'History',
    accent: '#2B4F9E',
    preview: 'the-dutch-golden-age',
    dateAdded: '2026-10-02',
    status: 'live',
  },
  {
    slug: 'radiation-therapy',
    title: 'Radiation therapy',
    hook: 'How invisible beams treat cancer, from the treatment room down to one strand of DNA.',
    category: 'Medicine',
    accent: '#17706B',
    preview: 'radiation-therapy',
    dateAdded: '2026-10-04',
    status: 'live',
    translations: {
      nl: {
        slug: 'radiotherapie',
        title: 'Radiotherapie',
        hook: 'Hoe onzichtbare stralen kanker behandelen, van de behandelkamer tot één streng DNA.',
        category: 'Geneeskunde',
      },
    },
    // For now the homepage shows the Dutch version of this topic. Remove this line to show English again.
    hubLanguage: 'nl',
  },
  {
    slug: 'tides-and-the-moon',
    title: 'Tides and the Moon',
    hook: 'Why the sea rises and falls twice a day, and why some tides are far bigger than others.',
    category: 'Nature',
    accent: '#5A3E8E',
    preview: 'tides-and-the-moon',
    dateAdded: '2026-10-06',
    status: 'live',
  },
  {
    slug: 'prime-numbers',
    title: 'Prime numbers',
    hook: 'Numbers that cannot be split. Strike out the rest, build rectangles and see why there is no last one.',
    category: 'Maths',
    accent: '#A8336A',
    preview: 'prime-numbers',
    dateAdded: '2026-10-06',
    status: 'live',
  },
  {
    slug: 'strings-and-notes',
    title: 'Strings and notes',
    hook: 'Pluck a string, shorten it, tighten it, and hear why some notes sound good together.',
    category: 'Music',
    accent: '#7A4B2A',
    preview: 'strings-and-notes',
    dateAdded: '2026-10-06',
    status: 'live',
  },
  {
    slug: 'why-we-have-seasons',
    title: 'Why we have seasons',
    hook: 'It is not the distance to the Sun. Turn four dials and find out what it is.',
    category: 'Space',
    accent: '#4E6B2E',
    preview: 'why-we-have-seasons',
    dateAdded: '2026-10-07',
    status: 'live',
  },
  {
    slug: 'morse-code',
    title: 'Morse code',
    hook: 'Tap out a message in dots and dashes, and find out why E is just one dot.',
    category: 'Language',
    accent: '#26364F',
    preview: 'morse-code',
    dateAdded: '2026-10-07',
    status: 'live',
  },
  {
    slug: 'how-bridges-carry-load',
    title: 'How bridges carry a load',
    hook: 'Load a plank, an arch, a cable and a triangle, and see which parts push and which pull.',
    category: 'Technology',
    accent: '#A9C4D4',
    preview: 'how-bridges-carry-load',
    dateAdded: '2026-10-07',
    status: 'live',
  },
  {
    slug: 'how-clocks-keep-time',
    title: 'How clocks keep time',
    hook: 'A swinging pendulum, a ticking wheel and a shaking crystal: open a clock and see what counts the seconds.',
    category: 'Technology',
    accent: '#E58B73',
    preview: 'how-clocks-keep-time',
    dateAdded: '2026-10-08',
    status: 'live',
  },
  {
    slug: 'how-chance-works',
    title: 'How chance works',
    hook: 'Roll dice, flip coins, share a birthday and pick a door, and see what chance really does.',
    category: 'Maths',
    accent: '#C5D18A',
    preview: 'how-chance-works',
    dateAdded: '2026-10-08',
    status: 'live',
  },
];

/** How a topic is shown in a list (homepage card, "next topic" card): where it leads, and in which words. */
export function getTopicView(topic: Topic) {
  const lang: Lang = topic.hubLanguage ?? 'en';
  const translation = lang === 'en' ? undefined : topic.translations?.[lang];
  if (lang !== 'en' && !translation) throw new Error(`Topic "${topic.slug}" has hubLanguage "${lang}" but no translation for it`);
  return {
    lang,
    href: translation ? `/${lang}/${translation.slug}/` : `/${topic.slug}/`,
    title: translation?.title ?? topic.title,
    hook: translation?.hook ?? topic.hook,
  };
}

/** Topics that should appear right now: everything in dev, only "live" in production. */
export function getVisibleTopics(): Topic[] {
  const showDrafts = import.meta.env.DEV;
  return topics
    .filter((t) => showDrafts || t.status === 'live')
    .sort((a, b) => a.dateAdded.localeCompare(b.dateAdded));
}

/** Categories that have at least one visible topic, in order of first appearance. */
export function getCategories(): string[] {
  return [...new Set(getVisibleTopics().map((t) => t.category))];
}

/** Display number ("01", "02", ...) based on position in the visible list. */
export function getTopicNumber(slug: string): string {
  const index = getVisibleTopics().findIndex((t) => t.slug === slug);
  return String(index + 1).padStart(2, '0');
}

export function getTopic(slug: string): Topic {
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) throw new Error(`No topic with slug "${slug}" in src/data/topics.ts`);
  return topic;
}

/** The topic after this one (wraps around). Undefined if there is no other topic. */
export function getNextTopic(slug: string): Topic | undefined {
  const visible = getVisibleTopics();
  const index = visible.findIndex((t) => t.slug === slug);
  const next = visible[(index + 1) % visible.length];
  return next && next.slug !== slug ? next : undefined;
}
