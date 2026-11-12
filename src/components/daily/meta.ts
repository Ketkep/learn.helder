// What the home page and the archive hand to the browser about each edition, so the browser can show
// the right one for the day without the site being rebuilt at midnight. Only built editions are in it.
import { editionPath, getEditions } from '../../data/editions';
import { readableInk } from '../../lib/color';
import { formatDay } from '../../lib/daily';

export interface EditionCard {
  number: number;
  date: string;
  dateLabel: string;
  title: string;
  question: string;
  teaser: string;
  minutes: number;
  subject: string;
  accent: string;
  ink: string;
  path: string;
  cover: string;
  /** The link preview picture, when there is one. */
  preview?: string;
}

export function editionCards(): EditionCard[] {
  return getEditions(import.meta.env.DEV).map((e) => ({
    number: e.number,
    date: e.date,
    dateLabel: formatDay(e.date),
    title: e.title,
    question: e.question,
    teaser: e.teaser,
    minutes: e.minutes,
    subject: e.subject,
    accent: e.accent,
    ink: readableInk(e.accent),
    path: editionPath(e),
    cover: `${editionPath(e)}cover.svg`,
    preview: previewOf(e.slug),
  }));
}

// The link preview pictures (src/editions/<slug>/preview.png, made by npm run og). The build gives each
// one an address with a hash in it, so a changed picture gets a new address and apps fetch it again.
const previews = import.meta.glob<string>('../../editions/*/preview.png', { query: '?url', import: 'default', eager: true });

/** The link preview picture of an edition, or undefined when it has not been made yet. */
export const previewOf = (slug: string): string | undefined => previews[`../../editions/${slug}/preview.png`];
