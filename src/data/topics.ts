// The topic registry: one list that drives the homepage grid,
// the "next topic" links and the numbering. To add a topic, add an entry here
// and create src/pages/<slug>/index.astro (see README.md).

export type TopicStatus = 'live' | 'draft';

export interface Topic {
  /** URL part and folder name: src/pages/<slug>/index.astro */
  slug: string;
  title: string;
  /** One line that makes people want to click. */
  hook: string;
  category: string;
  /** Bright color (hex). Text on top of it is always dark, so keep it light enough. */
  accent: string;
  /** Image path inside /public. A simple SVG works best. */
  preview: string;
  /** YYYY-MM-DD. Topics are ordered by this date, oldest first. */
  dateAdded: string;
  /** "draft" topics show up in `npm run dev` only. */
  status: TopicStatus;
}

export const topics: Topic[] = [
  {
    slug: 'english-tenses-on-a-timeline',
    title: 'English tenses on a timeline',
    hook: 'Drag through time and see why English needs so many tenses.',
    category: 'Language',
    accent: '#8EC5FF',
    preview: '/previews/english-tenses-on-a-timeline.svg',
    dateAdded: '2026-10-01',
    status: 'draft',
  },
  {
    slug: 'compound-interest',
    title: 'Compound interest',
    hook: 'Move the sliders and watch small amounts grow.',
    category: 'Money',
    accent: '#7BDCA6',
    preview: '/previews/compound-interest.svg',
    dateAdded: '2026-10-01',
    status: 'draft',
  },
  {
    slug: 'how-a-website-reaches-your-screen',
    title: 'How a website reaches your screen',
    hook: 'Follow one click from your browser to a server and back.',
    category: 'Technology',
    accent: '#FFA66B',
    preview: '/previews/how-a-website-reaches-your-screen.svg',
    dateAdded: '2026-10-01',
    status: 'draft',
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
