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
  }));
}
