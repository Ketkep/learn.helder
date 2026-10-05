// The topic registry: one list that drives the homepage grid,
// the "next topic" links and the numbering. To add a topic, add an entry here
// and create src/pages/<slug>/index.astro (see README.md).

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
  /** Other languages this topic is available in. The homepage and the numbering stay English. */
  translations?: { nl?: TopicTranslation };
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
  },
];

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
