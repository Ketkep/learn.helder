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
  /** One mid-tone color (hex). Panels, drawings and tints are mixed from it, in light and dark mode. */
  accent: string;
  /** Name of an SVG file in src/previews, without ".svg". */
  preview: string;
  /** YYYY-MM-DD. Topics are ordered by this date, oldest first. */
  dateAdded: string;
  /** "draft" topics show up in `npm run dev` only. */
  status: TopicStatus;
}

// The three entries below are placeholders so the design has cards to show.
// Replace them with real topics, or set them to 'draft', before you point
// learn.helderlabs.com at this site.
export const topics: Topic[] = [
  {
    slug: 'english-tenses-on-a-timeline',
    title: 'English tenses on a timeline',
    hook: 'Drag through time and see why English needs so many tenses.',
    category: 'Language',
    accent: '#5B8FD9',
    preview: 'english-tenses-on-a-timeline',
    dateAdded: '2026-10-01',
    status: 'live',
  },
  {
    slug: 'compound-interest',
    title: 'Compound interest',
    hook: 'Move the sliders and watch small amounts grow.',
    category: 'Money',
    accent: '#4FAE82',
    preview: 'compound-interest',
    dateAdded: '2026-10-01',
    status: 'live',
  },
  {
    slug: 'how-a-website-reaches-your-screen',
    title: 'How a website reaches your screen',
    hook: 'Follow one click from your browser to a server and back.',
    category: 'Technology',
    accent: '#E5739B',
    preview: 'how-a-website-reaches-your-screen',
    dateAdded: '2026-10-01',
    status: 'live',
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
